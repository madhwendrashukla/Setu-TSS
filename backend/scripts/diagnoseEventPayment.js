// READ-ONLY diagnosis for a Razorpay payment that is "Captured" in Razorpay but
// missing from the admin Registrations tab. Writes nothing.
//
// Usage: node scripts/diagnoseEventPayment.js <pay_xxx> [<pay_yyy> ...]
//
// For each payment it pulls the payment + its order from Razorpay, then every
// event_registrations row and CRM lead for that order / buyer, and prints which
// failure path the evidence points to:
//   A  row still PENDING with this order id   -> verify-payment never reached the server
//   B  buyer's row carries a DIFFERENT order  -> a later create-order overwrote the order id
//   C  row FAILED                             -> verify-payment ran but the signature check failed
//   D  no row for this buyer at all           -> row never written here, or deleted afterwards
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const ist = (d) => (d ? new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '-');
const last10 = (p) => (p || '').replace(/\D/g, '').slice(-10);

async function diagnose(paymentId) {
  console.log(`\n================ ${paymentId} ================`);
  const pay = await razorpay.payments.fetch(paymentId);
  const order = pay.order_id ? await razorpay.orders.fetch(pay.order_id) : null;
  const email = pay.email;
  const phone = last10(pay.contact);

  console.log(`Razorpay payment : ${pay.status}  ₹${pay.amount / 100}  ${pay.method} ${pay.vpa || ''}`);
  console.log(`  buyer          : ${email} / ${pay.contact}`);
  console.log(`  payment created: ${ist(pay.created_at * 1000)}`);
  if (order) {
    console.log(`Razorpay order   : ${order.id}  status=${order.status}  attempts=${order.attempts}`);
    console.log(`  order created  : ${ist(order.created_at * 1000)}  receipt=${order.receipt}`);
  }

  const rows = await prisma.eventRegistration.findMany({
    where: {
      OR: [
        ...(pay.order_id ? [{ razorpay_order_id: pay.order_id }] : []),
        { razorpay_payment_id: paymentId },
        ...(email ? [{ guest_email: { equals: email, mode: 'insensitive' } }] : []),
        ...(phone ? [{ guest_phone: { contains: phone } }] : []),
      ],
    },
    orderBy: { created_at: 'asc' },
  });

  console.log(`DB rows for this order/buyer: ${rows.length}`);
  for (const r of rows) {
    console.log(
      `  - ${r.status.padEnd(9)} event=${r.event_id} order=${r.razorpay_order_id || '-'} pay=${r.razorpay_payment_id || '-'}` +
      ` amount=${r.amount} created=${ist(r.created_at)} updated=${ist(r.updated_at)}`
    );
  }

  const leads = await prisma.lead.findMany({
    where: {
      OR: [
        ...(email ? [{ email: { equals: email, mode: 'insensitive' } }] : []),
        ...(phone ? [{ phone: { contains: phone } }] : []),
      ],
    },
  });
  for (const l of leads) {
    console.log(`  lead: source=${l.source} status=${l.status} created=${ist(l.created_at)} ${l.message || ''}`);
  }

  const byOrder = rows.find((r) => r.razorpay_order_id === pay.order_id);
  let verdict;
  if (byOrder && byOrder.status === 'COMPLETED') {
    verdict = 'OK — row is COMPLETED. If the tab hides it, check the event filter / event_id.';
  } else if (byOrder && byOrder.status === 'PENDING') {
    verdict = 'A — row still PENDING for the paid order: verify-payment never reached the server.';
  } else if (byOrder && byOrder.status === 'FAILED') {
    verdict = 'C — row FAILED: verify-payment ran but the signature check failed.';
  } else if (rows.some((r) => r.razorpay_order_id && r.razorpay_order_id !== pay.order_id)) {
    verdict = 'B — buyer\'s row points at a different order: a later create-order overwrote the paid order id.';
  } else {
    verdict = 'D — no row for this buyer: never written to this database, or deleted afterwards.';
  }
  console.log(`VERDICT: ${verdict}`);
}

async function main() {
  const ids = process.argv.slice(2);
  if (ids.length === 0) {
    console.error('Usage: node scripts/diagnoseEventPayment.js <pay_xxx> [<pay_yyy> ...]');
    process.exit(1);
  }
  for (const id of ids) {
    try {
      await diagnose(id);
    } catch (err) {
      console.error(`${id}: ${err.error?.description || err.message}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
