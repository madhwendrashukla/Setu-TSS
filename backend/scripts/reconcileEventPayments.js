// Safety net for event payments: finds registrations still PENDING whose
// Razorpay order is actually PAID, and (with --apply) completes them through
// the same completeEventRegistration() the live verify-payment / webhook paths
// use. Normally finds nothing now that the Razorpay webhook exists — run it if
// the webhook was down or misconfigured. Background: incident 2026-10-02.
//
// DRY RUN by default — lists what it would change and writes nothing.
//
// Usage: node scripts/reconcileEventPayments.js [--apply] [--email] [order_xxx ...]
//   no order ids -> every PENDING row that has a Razorpay order
//   --apply      -> mark the paid ones COMPLETED
//   --email      -> also send the confirmation email (off by default: by the
//                   time a reconcile runs, the event may already be over)
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');
const { completeEventRegistration } = require('../routes/payments');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const sendEmail = args.includes('--email');
  const orderIds = args.filter((a) => a.startsWith('order_'));

  const rows = await prisma.eventRegistration.findMany({
    where: {
      status: 'PENDING',
      razorpay_order_id: orderIds.length ? { in: orderIds } : { not: null },
    },
    orderBy: { created_at: 'asc' },
  });

  console.log(apply ? 'APPLY MODE — writing changes\n' : 'DRY RUN — nothing will be written (add --apply)\n');

  let count = 0;
  for (const r of rows) {
    let order;
    try {
      order = await razorpay.orders.fetch(r.razorpay_order_id);
    } catch (_) {
      continue; // unknown to this Razorpay account (e.g. old test-key order)
    }
    if (order.status !== 'paid') continue;

    const payments = await razorpay.orders.fetchPayments(r.razorpay_order_id);
    const captured = (payments.items || []).find((p) => p.status === 'captured');
    if (!captured) {
      console.log(`  SKIP ${r.razorpay_order_id}: order paid but no captured payment`);
      continue;
    }
    if (Math.round(captured.amount / 100) !== r.amount) {
      console.log(`  SKIP ${r.razorpay_order_id}: paid ₹${captured.amount / 100} but row expects ₹${r.amount}`);
      continue;
    }

    console.log(`  ${apply ? 'COMPLETE' : 'WOULD COMPLETE'} row=${r.id} order=${r.razorpay_order_id} pay=${captured.id} ${r.guest_email || ''}`);
    if (!apply) {
      count++;
      continue;
    }

    const notes = order.notes && !Array.isArray(order.notes) ? order.notes : {};
    const { completed } = await completeEventRegistration(r, {
      orderId: r.razorpay_order_id,
      paymentId: captured.id,
      couponCode: notes.coupon_code || null,
      contactEmail: captured.email || null,
      contactPhone: captured.contact || null,
      sendEmail,
    });
    if (completed) count++;
    else console.log('    (completed meanwhile by verify-payment/webhook — left as is)');
  }

  console.log(`\n${apply ? 'Completed' : 'Would complete'}: ${count}`);
}

main()
  .catch((err) => console.error(err.error?.description || err.message))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0); // the shared payments module keeps its own DB pool open
  });
