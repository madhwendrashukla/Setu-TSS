// READ-ONLY reconciliation: lists every event registration still PENDING whose
// Razorpay order is actually PAID — buyers who paid but never got a COMPLETED
// row (see docs/incidents/2026-10-02_bhubaneswar_paid_registrations_missing.md).
// Writes nothing.
//
// Usage: node scripts/findPaidPendingRegistrations.js [eventId]
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const ist = (d) => (d ? new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '-');

async function main() {
  const eventId = process.argv[2];

  const completedPaid = await prisma.eventRegistration.count({
    where: { status: 'COMPLETED', amount: { gt: 0 }, ...(eventId ? { event_id: eventId } : {}) },
  });
  const pending = await prisma.eventRegistration.findMany({
    where: { status: 'PENDING', razorpay_order_id: { not: null }, ...(eventId ? { event_id: eventId } : {}) },
    orderBy: { created_at: 'asc' },
  });

  console.log(`COMPLETED paid registrations     : ${completedPaid}`);
  console.log(`PENDING rows with a Razorpay order: ${pending.length} (checking each with Razorpay...)\n`);

  let paidButPending = 0;
  for (const r of pending) {
    let order;
    try {
      order = await razorpay.orders.fetch(r.razorpay_order_id);
    } catch (err) {
      console.log(`  ? ${r.razorpay_order_id}: ${err.error?.description || err.message}`);
      continue;
    }
    if (order.status !== 'paid') continue;

    const payments = await razorpay.orders.fetchPayments(r.razorpay_order_id);
    const captured = (payments.items || []).find((p) => p.status === 'captured');
    paidButPending++;
    console.log(
      `  PAID-BUT-PENDING  event=${r.event_id} order=${r.razorpay_order_id} pay=${captured ? captured.id : '-'}` +
      ` ₹${order.amount_paid / 100} ${captured ? captured.method : ''} ${r.guest_email || ''} order_created=${ist(order.created_at * 1000)}`
    );
  }

  console.log(`\nPaid but never COMPLETED: ${paidButPending}`);
}

main().finally(() => prisma.$disconnect());
