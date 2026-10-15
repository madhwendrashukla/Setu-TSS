// Recovery for paid-but-PENDING event registrations: buyers whose Razorpay
// order is PAID but whose browser never called /api/payments/verify-payment
// (see docs/incidents/2026-10-02_bhubaneswar_paid_registrations_missing.md).
//
// DRY RUN by default — prints what it would change and writes nothing.
//
// Usage: node scripts/completePaidPendingRegistrations.js [--apply] [order_xxx ...]
//   no order ids -> every PENDING row whose Razorpay order is paid
//   --apply      -> actually mark them COMPLETED (same writes verify-payment makes,
//                   minus the confirmation email)
//
// Each row is re-checked against Razorpay right before writing and only touched
// if the order is paid with a captured payment and the row is still PENDING.
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const orderIds = args.filter((a) => a.startsWith('order_'));

  const rows = await prisma.eventRegistration.findMany({
    where: {
      status: 'PENDING',
      razorpay_order_id: orderIds.length ? { in: orderIds } : { not: null },
    },
    orderBy: { created_at: 'asc' },
  });

  console.log(apply ? 'APPLY MODE — writing changes\n' : 'DRY RUN — nothing will be written (add --apply)\n');

  let changed = 0;
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
      changed++;
      continue;
    }

    // Guarded on status so a concurrent verify-payment can't be double-applied.
    const res = await prisma.eventRegistration.updateMany({
      where: { id: r.id, status: 'PENDING' },
      data: { status: 'COMPLETED', razorpay_payment_id: captured.id },
    });
    if (res.count === 0) {
      console.log('    (row changed meanwhile — left as is)');
      continue;
    }
    changed++;

    // Mirror verify-payment: the buyer is now an attendee, so drop their checkout lead.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r.event_id);
    const event = await prisma.event.findFirst({
      where: { OR: [{ slug: r.event_id }, ...(isUuid ? [{ id: r.event_id }] : [])] },
      select: { id: true, slug: true },
    });
    const sources = [r.event_id, event?.id, event?.slug].filter(Boolean).map((v) => `checkout_${v}`);
    const contacts = [
      ...(r.guest_email ? [{ email: r.guest_email }] : []),
      ...(r.guest_phone ? [{ phone: r.guest_phone }] : []),
    ];
    if (contacts.length) {
      const del = await prisma.lead.deleteMany({ where: { OR: contacts, source: { in: sources } } });
      console.log(`    removed ${del.count} checkout lead(s)`);
    }
  }

  console.log(`\n${apply ? 'Completed' : 'Would complete'}: ${changed}`);
}

main().finally(() => prisma.$disconnect());
