// Manually re-fires the LMS enrollment webhook for a paid order whose
// delivery failed (webhook_status = 'failed' / stuck 'pending').
//
// Usage: node scripts/replayWebhook.js <orderId>
// A 409 from the LMS means the student is already enrolled — treated as
// success, so replaying is always safe.
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEnrollmentWebhook } = require('../utils/lmsWebhook');

async function main() {
  const orderId = process.argv[2];
  if (!orderId) {
    console.error('Usage: node scripts/replayWebhook.js <orderId>');
    process.exit(1);
  }

  const order = await prisma.courseOrder.findUnique({ where: { id: orderId } });
  if (!order) {
    console.error(`Order ${orderId} not found`);
    process.exit(1);
  }
  if (order.status !== 'paid') {
    console.error(`Order ${orderId} is '${order.status}', not 'paid' — refusing to enroll an unpaid order`);
    process.exit(1);
  }

  console.log(`Replaying webhook for order ${orderId} (${order.course_slug}, ${order.buyer_email})...`);
  const ok = await sendEnrollmentWebhook({
    id: order.id,
    buyerEmail: order.buyer_email,
    buyerName: order.buyer_name,
    lmsCourseId: order.lms_course_id,
    razorpayOrderId: order.razorpay_order_id,
    utmSource: order.utm_source,
    utmMedium: order.utm_medium,
    utmCampaign: order.utm_campaign,
  });
  console.log(ok ? 'Delivered.' : 'Still failing — check WebhookDelivery rows for details.');
  process.exit(ok ? 0 : 2);
}

main();
