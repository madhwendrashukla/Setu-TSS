const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getCourseBySlug, getBundleMemberCourseIds } = require('../utils/lmsDb');
const { sendEnrollmentWebhook } = require('../utils/lmsWebhook');
const { validateCouponForCourse, applyCouponPaise, recordCouponUsage } = require('../utils/coupons');
const jwt = require('jsonwebtoken');
const { requiredEnv } = require('../utils/requiredEnv');

// Email verification at checkout — reuses the existing OTP flow (/api/otp/send
// + /api/otp/verify, which issues a 30-min guest token). Default ON; set
// COURSE_EMAIL_VERIFICATION=false to disable instantly without a rebuild.
const EMAIL_VERIFY_ON = process.env.COURSE_EMAIL_VERIFICATION !== 'false';

// Returns null when the request carries a valid guest token matching `email`
// (or when verification is disabled), otherwise a { status, body } to send.
function requireEmailVerification(req, email) {
  if (!EMAIL_VERIFY_ON) return null;
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) {
    try {
      const d = jwt.verify(token, requiredEnv('GUEST_TOKEN_SECRET'));
      if (d && d.guest && String(d.email).toLowerCase() === String(email).trim().toLowerCase()) {
        return null; // verified
      }
    } catch { /* invalid/expired token → fall through to 403 */ }
  }
  return { status: 403, body: { error: 'Please verify your email to continue.', code: 'EMAIL_NOT_VERIFIED' } };
}

// Lazy so the backend still boots (and every non-payment route works) when
// Razorpay keys aren't configured yet; payment routes then 503 cleanly.
let razorpayClient = null;
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayClient;
}

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment requests, please try again later' },
});

router.use(paymentLimiter);

// POST /api/course-payments/capture-lead
// Immature-lead capture: the visitor typed an email into the checkout but
// hasn't paid (or even finished the form). Best-effort upsert into the CRM
// leads so half-finished checkouts aren't lost. Never blocks the UI.
router.post('/capture-lead', async (req, res) => {
  try {
    const { email, name, phone, slug } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const fullName = (name && String(name).trim()) || cleanEmail.split('@')[0];
    const source = 'Course checkout (incomplete)';
    const existing = await prisma.lead.findFirst({ where: { email: cleanEmail, source } });
    if (existing) {
      await prisma.lead.update({
        where: { id: existing.id },
        data: { full_name: fullName, phone: phone?.trim() || existing.phone, message: slug || existing.message },
      });
    } else {
      await prisma.lead.create({
        data: { full_name: fullName, email: cleanEmail, phone: phone?.trim() || null, source, status: 'new', message: slug || null },
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('capture-lead error:', err.message);
    res.status(200).json({ success: false }); // best-effort — never break checkout UX
  }
});

// Ownership credit (Scenario #10 upgrade + #13 re-purchase): the buyer never
// pays twice for content they already own. We credit the money they ALREADY
// PAID for any course overlapping this purchase — bundles expand to their
// member courses on BOTH sides — and cap the credit at the order total so the
// payable is never negative. This never blocks: a fully-owned re-purchase just
// nets to ₹0 (handled by the caller as a no-charge, access-granting order).
async function computeOwnershipCreditPaise({ email, newGrantIds, amountPaise }) {
  const priorPaid = await prisma.courseOrder.findMany({
    where: { buyer_email: email, status: 'paid' },
    select: { lms_course_id: true, amount: true },
  });
  let creditPaise = 0;
  for (const p of priorPaid) {
    if (!p.amount || p.amount <= 0) continue; // free/already-credited grants cost nothing to credit back
    let grantSet;
    try {
      const members = await getBundleMemberCourseIds(p.lms_course_id);
      grantSet = members.length > 0 ? members : [p.lms_course_id];
    } catch {
      grantSet = [p.lms_course_id];
    }
    const overlap = grantSet.filter((id) => newGrantIds.includes(id));
    if (overlap.length === 0) continue;
    // Attribute the prior payment to the share of its grant that overlaps.
    creditPaise += Math.round((p.amount * overlap.length) / grantSet.length);
  }
  return Math.min(creditPaise, amountPaise);
}

// POST /api/course-payments/create-order
// The price is always read from the LMS Course table server-side — the
// client never supplies an amount. Free courses are rejected here: free
// enrollment is self-service inside the LMS and never touches Razorpay.
router.post('/create-order', async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({ error: 'Payments are not configured yet' });
    }
    const { slug, email, name, phone, couponCode, utmSource, utmMedium, utmCampaign } = req.body;
    if (!slug || !email || !name) {
      return res.status(400).json({ error: 'slug, email and name are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Gate on a verified email (reuses the OTP guest token). Disabled ⇒ no-op.
    const _gate = requireEmailVerification(req, email);
    if (_gate) return res.status(_gate.status).json(_gate.body);

    const course = await getCourseBySlug(slug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.price <= 0) {
      return res.status(400).json({ error: 'This course is free — use the free enrollment option' });
    }

    // The LMS stores Course.price in RUPEES; Razorpay (and our order
    // records) work in PAISE. Convert exactly once, here.
    const originalPaise = Math.round(course.price * 100);

    // Coupons are validated and priced entirely server-side — an invalid code
    // fails the order loudly rather than silently charging full price.
    let amountPaise = originalPaise;
    let discountPaise = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const check = await validateCouponForCourse({
        code: couponCode,
        email: email.trim().toLowerCase(),
        courseSlug: course.slug,
      });
      if (!check.ok) {
        return res.status(400).json({ error: check.error });
      }
      appliedCoupon = check.coupon;
      ({ amount: amountPaise, discount: discountPaise } = applyCouponPaise(originalPaise, appliedCoupon));
    }

    const buyerEmail = email.trim().toLowerCase();

    // Expand this purchase to the member courses it grants (bundle → members,
    // else the course itself), then credit anything the buyer already paid for.
    let newGrantIds;
    try {
      const members = await getBundleMemberCourseIds(course.id);
      newGrantIds = members.length > 0 ? members : [course.id];
    } catch (err) {
      console.error('Bundle expansion failed (treating as single course):', err);
      newGrantIds = [course.id];
    }
    const creditPaise = await computeOwnershipCreditPaise({
      email: buyerEmail,
      newGrantIds,
      amountPaise,
    });
    const payablePaise = amountPaise - creditPaise;

    // Fully covered by credit (e.g. re-buying something already owned): grant
    // access with no Razorpay charge — it can't take ₹0 — and never block.
    if (payablePaise <= 0) {
      const creditedOrder = await prisma.courseOrder.create({
        data: {
          lms_course_id: course.id,
          course_slug: course.slug,
          course_title: course.title,
          amount: 0,
          currency: 'INR',
          buyer_email: buyerEmail,
          buyer_name: name.trim(),
          buyer_phone: phone?.trim() || null,
          status: 'paid', // fully credited — nothing to collect
          webhook_status: 'pending',
          coupon_code: appliedCoupon ? appliedCoupon.code : null,
          discount_amount: appliedCoupon ? discountPaise : null,
          credit_amount: creditPaise,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
        },
      });
      // Bundle-aware, idempotent: members already owned come back 409 from the
      // LMS (no double enrollment); any not-yet-owned member gets provisioned.
      await dispatchEnrollment(creditedOrder, {
        razorpayOrderId: `credit_${creditedOrder.id}`,
        paymentStatus: 'paid',
      });
      return res.json({
        fullyCredited: true,
        orderId: creditedOrder.id,
        credit: creditPaise, // paise credited for already-owned courses
        originalAmount: originalPaise, // paise, pre-coupon
        courseTitle: course.title,
      });
    }

    const order = await prisma.courseOrder.create({
      data: {
        lms_course_id: course.id,
        course_slug: course.slug,
        course_title: course.title,
        amount: payablePaise,
        currency: 'INR',
        buyer_email: buyerEmail,
        buyer_name: name.trim(),
        buyer_phone: phone?.trim() || null,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        discount_amount: appliedCoupon ? discountPaise : null,
        credit_amount: creditPaise || null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: payablePaise,
      currency: 'INR',
      receipt: order.id,
      notes: { courseSlug: course.slug, orderId: order.id },
    });

    await prisma.courseOrder.update({
      where: { id: order.id },
      data: { razorpay_order_id: razorpayOrder.id },
    });

    res.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: payablePaise, // paise — what Razorpay checkout expects (post-coupon, post-credit)
      originalAmount: originalPaise, // paise, pre-coupon
      discount: discountPaise, // paise
      credit: creditPaise, // paise credited for already-owned courses
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      courseTitle: course.title,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/course-payments/validate-coupon
// Instant checkout feedback: validates the code against the shared coupon
// system AND returns the exact discounted price for THIS course, all
// server-side. create-order re-validates — this response is display-only.
router.post('/validate-coupon', async (req, res) => {
  try {
    const { slug, code, email } = req.body;
    if (!slug || !code) {
      return res.status(400).json({ error: 'slug and code are required' });
    }
    const course = await getCourseBySlug(slug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.price <= 0) {
      return res.status(400).json({ error: 'Coupons do not apply to free courses' });
    }
    const check = await validateCouponForCourse({
      code,
      email: email ? String(email).trim().toLowerCase() : undefined,
      courseSlug: course.slug,
    });
    if (!check.ok) {
      return res.status(400).json({ valid: false, error: check.error });
    }
    const originalPaise = Math.round(course.price * 100);
    const { amount, discount } = applyCouponPaise(originalPaise, check.coupon);
    res.json({
      valid: true,
      code: check.coupon.code,
      type: check.coupon.type,
      discountValue: check.coupon.discount_value,
      originalAmount: originalPaise,
      discount,
      amount,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

// Enrolls the buyer for an order. If the purchased course is a BUNDLE (has
// CourseBundleItem members in the LMS), the buyer is enrolled into each member
// course instead of the (content-less) bundle course; otherwise into the
// course itself. Webhooks are fired SEQUENTIALLY in the background so a new
// user is created exactly once (the receiver reuses it on the next calls) —
// firing them in parallel could race on user creation. The response isn't
// blocked by the (retrying) webhook dispatch.
async function dispatchEnrollment(order, extra = {}) {
  let memberIds = [];
  try {
    memberIds = await getBundleMemberCourseIds(order.lms_course_id);
  } catch (err) {
    console.error('Bundle member lookup failed (enrolling in the course itself):', err);
  }
  const isBundle = memberIds.length > 0;
  const courseIds = isBundle ? memberIds : [order.lms_course_id];

  (async () => {
    for (let i = 0; i < courseIds.length; i++) {
      const courseId = courseIds[i];
      try {
        await sendEnrollmentWebhook({
          id: order.id,
          buyerEmail: order.buyer_email,
          buyerName: order.buyer_name,
          buyerPhone: order.buyer_phone,
          lmsCourseId: courseId,
          razorpayOrderId: extra.razorpayOrderId || order.razorpay_order_id,
          paymentStatus: extra.paymentStatus,
          utmSource: order.utm_source,
          utmMedium: order.utm_medium,
          utmCampaign: order.utm_campaign,
          // Bundle context lets the LMS collapse the per-member fan-out into a
          // single credentials email + one course summary (instead of N emails).
          bundle: isBundle
            ? {
                title: order.course_title,
                index: i,
                total: courseIds.length,
                memberCourseIds: courseIds,
              }
            : undefined,
        });
      } catch (err) {
        console.error(`Webhook dispatch error (course ${courseId}, order ${order.id}):`, err);
      }
    }
  })();
}

// Marks the order paid and fires enrollment (bundle-aware). Factored out so an
// inbound Razorpay payment.captured webhook can reuse it later; both paths stay
// idempotent via the status check.
async function fulfillOrder(order, razorpayPaymentId) {
  const updated = await prisma.courseOrder.update({
    where: { id: order.id },
    data: {
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId,
      webhook_status: 'pending',
    },
  });

  await dispatchEnrollment(updated);

  // Count the coupon use only once the money actually moved. Fire-and-forget:
  // a failure here must never block enrollment (reconcile from CourseOrder).
  if (updated.coupon_code) {
    recordCouponUsage(updated.coupon_code, updated.buyer_email).catch((err) =>
      console.error('Coupon usage recording error:', err)
    );
  }
}

// POST /api/course-payments/enroll-free
// Self-serve enrollment for FREE courses (Unified Events WP-11). The course
// must be PUBLISHED (getCourseBySlug filters) and actually priced 0 — the
// client's claim that something is free is never trusted. No Razorpay
// involved: a zero-amount order is recorded and the same signed enrollment
// webhook provisions the LMS account (paymentStatus 'free').
router.post('/enroll-free', async (req, res) => {
  try {
    const { slug, email, name, phone, utmSource, utmMedium, utmCampaign } = req.body;
    if (!slug || !email || !name) {
      return res.status(400).json({ error: 'slug, email and name are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Gate on a verified email (reuses the OTP guest token). Disabled ⇒ no-op.
    const _gate = requireEmailVerification(req, email);
    if (_gate) return res.status(_gate.status).json(_gate.body);

    const course = await getCourseBySlug(slug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.price > 0) {
      return res.status(400).json({ error: 'This course is paid — use the checkout' });
    }

    const order = await prisma.courseOrder.create({
      data: {
        lms_course_id: course.id,
        course_slug: course.slug,
        course_title: course.title,
        amount: 0,
        currency: 'INR',
        buyer_email: email.trim().toLowerCase(),
        buyer_name: name.trim(),
        buyer_phone: phone?.trim() || null,
        status: 'paid', // fulfilled immediately — nothing to collect
        webhook_status: 'pending',
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      },
    });

    // Same bundle-aware dispatch as paid orders; duplicates come back as 409
    // from the LMS and count as delivered (no double enrollment). A free bundle
    // grants all its member courses.
    await dispatchEnrollment(order, { razorpayOrderId: `free_${order.id}`, paymentStatus: 'free' });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in free enrollment:', error);
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

// POST /api/course-payments/verify
// Standard Razorpay checkout signature check:
// HMAC-SHA256(order_id|payment_id, key_secret) must equal razorpay_signature.
router.post('/verify', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ error: 'Payments are not configured yet' });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    const order = await prisma.courseOrder.findUnique({
      where: { razorpay_order_id },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Idempotent: a repeated verify for a paid order succeeds without
    // re-firing the enrollment webhook.
    if (order.status === 'paid') {
      return res.json({ success: true, alreadyProcessed: true });
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuf = Buffer.from(expected, 'hex');
    const receivedBuf = Buffer.from(razorpay_signature, 'hex');
    const valid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!valid) {
      await prisma.courseOrder.update({
        where: { id: order.id },
        data: { status: 'failed' },
      });
      return res.status(400).json({ error: 'Payment signature verification failed' });
    }

    await fulfillOrder(order, razorpay_payment_id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
