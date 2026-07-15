const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getCourseBySlug } = require('../utils/lmsDb');
const { sendEnrollmentWebhook } = require('../utils/lmsWebhook');
const { validateCouponForCourse, applyCouponPaise, recordCouponUsage } = require('../utils/coupons');

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

    const order = await prisma.courseOrder.create({
      data: {
        lms_course_id: course.id,
        course_slug: course.slug,
        course_title: course.title,
        amount: amountPaise,
        currency: 'INR',
        buyer_email: email.trim().toLowerCase(),
        buyer_name: name.trim(),
        buyer_phone: phone?.trim() || null,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        discount_amount: appliedCoupon ? discountPaise : null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
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
      amount: amountPaise, // paise — what Razorpay checkout expects
      originalAmount: originalPaise, // paise, pre-coupon
      discount: discountPaise, // paise
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

// Marks the order paid and fires the signed enrollment webhook to the LMS.
// Factored out so an inbound Razorpay payment.captured webhook can reuse it
// later; both paths stay idempotent via the status check.
async function fulfillOrder(order, razorpayPaymentId) {
  const updated = await prisma.courseOrder.update({
    where: { id: order.id },
    data: {
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId,
      webhook_status: 'pending',
    },
  });
  // Fire-and-forget with in-module retries; failures land in WebhookDelivery
  // and the order's webhook_status for scripts/replayWebhook.js.
  sendEnrollmentWebhook({
    id: updated.id,
    buyerEmail: updated.buyer_email,
    buyerName: updated.buyer_name,
    lmsCourseId: updated.lms_course_id,
    razorpayOrderId: updated.razorpay_order_id,
    utmSource: updated.utm_source,
    utmMedium: updated.utm_medium,
    utmCampaign: updated.utm_campaign,
  }).catch((err) => console.error('Webhook dispatch error:', err));

  // Count the coupon use only once the money actually moved. Fire-and-forget:
  // a failure here must never block enrollment (reconcile from CourseOrder).
  if (updated.coupon_code) {
    recordCouponUsage(updated.coupon_code, updated.buyer_email).catch((err) =>
      console.error('Coupon usage recording error:', err)
    );
  }
}

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
