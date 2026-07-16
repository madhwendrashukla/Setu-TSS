const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Server-side coupon validation for COURSE checkout (Unified Events WP-2).
//
// One coupon system for the whole site: this validates against the same
// Coupon/CouponUsage tables the event checkout uses (routes/coupons.js), with
// the same semantics — active flag, date window, global + per-user usage
// limits, email allowlist, and the per-event applicable_coupons restriction
// (looked up via the linked event's page_blocks when the course has one).
// The client NEVER supplies amounts; callers compute the discount here and
// charge that — nothing else.

function dayAfter(date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
}

// Returns { ok: true, coupon } or { ok: false, error }.
async function validateCouponForCourse({ code, email, courseSlug }) {
  if (!code || typeof code !== 'string') {
    return { ok: false, error: 'No coupon code provided' };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });
  if (!coupon) return { ok: false, error: 'Invalid coupon code' };
  if (!coupon.is_active) return { ok: false, error: 'Coupon is no longer active' };

  const now = new Date();
  if (coupon.start_date && new Date(coupon.start_date) > now) {
    return { ok: false, error: 'Coupon is not yet active' };
  }
  // end_date is inclusive (expires at the END of that calendar day) — matches
  // the event checkout's date-string semantics.
  if (coupon.end_date && now >= dayAfter(coupon.end_date)) {
    return { ok: false, error: 'Coupon has expired' };
  }
  if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
    return { ok: false, error: 'Coupon usage limit reached' };
  }
  if (coupon.applicable_emails && coupon.applicable_emails.length > 0) {
    if (!email || !coupon.applicable_emails.includes(email)) {
      return { ok: false, error: 'Coupon is not applicable for this email' };
    }
  }
  if (coupon.max_uses_per_user !== null && email) {
    const used = await prisma.couponUsage.count({
      where: { coupon_id: coupon.id, user_email: email },
    });
    if (used >= coupon.max_uses_per_user) {
      return { ok: false, error: 'You have reached the maximum usage for this coupon' };
    }
  }

  // If the course's linked event restricts coupons in the builder
  // (page_blocks.applicable_coupons), honor it — same rule as event checkout.
  if (courseSlug) {
    const event = await prisma.event.findFirst({
      where: { lms_course_slug: courseSlug },
      select: { page_blocks: true },
    });
    if (event && event.page_blocks) {
      let pageData = event.page_blocks;
      if (typeof pageData === 'string') {
        try { pageData = JSON.parse(pageData); } catch { pageData = null; }
      }
      const allowed = pageData && pageData.applicable_coupons;
      if (Array.isArray(allowed) && allowed.length > 0 && !allowed.includes(coupon.code)) {
        return { ok: false, error: 'This coupon code is not valid for this course' };
      }
    }
  }

  return { ok: true, coupon };
}

// All math in PAISE (the rupees→paise conversion still happens exactly once,
// on the original price). Razorpay's minimum charge is ₹1 = 100 paise.
function applyCouponPaise(originalPaise, coupon) {
  const discount =
    coupon.type === 'percentage'
      ? Math.round((originalPaise * coupon.discount_value) / 100)
      : Math.round(coupon.discount_value * 100);
  const amount = Math.max(100, originalPaise - discount);
  return { amount, discount: originalPaise - amount };
}

// Called after an order is PAID. Failure here must never block enrollment —
// callers fire-and-forget; errors are logged for reconciliation.
async function recordCouponUsage(code, email) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });
  if (!coupon) return;
  await prisma.$transaction([
    prisma.couponUsage.create({
      data: { coupon_id: coupon.id, user_email: email || null },
    }),
    prisma.coupon.update({
      where: { id: coupon.id },
      data: { current_uses: { increment: 1 } },
    }),
  ]);
}

module.exports = { validateCouponForCourse, applyCouponPaise, recordCouponUsage };
