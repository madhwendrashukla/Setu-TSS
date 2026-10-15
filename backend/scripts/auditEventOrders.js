// READ-ONLY audit of every Razorpay order in a date range against our database.
// Writes nothing.
//
// Usage: node scripts/auditEventOrders.js <from YYYY-MM-DD> <to YYYY-MM-DD>   (IST dates, inclusive)
//
// For each order: Razorpay status/attempts, every payment attempt (with the
// bank/UPI error for failed ones), the DB row that still references the order,
// and — for orders no row references any more — the buyer it most likely
// belonged to and whether that buyer paid in the end.
//
// Why orders can lose their DB link: create-order reuses a buyer's PENDING row
// and overwrites razorpay_order_id, so an abandoned order is "forgotten" as
// soon as the same buyer clicks Pay again.
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const Razorpay = require('razorpay');

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const ist = (ms) => new Date(ms).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
const nginxStamp = (ms) => {
  // 01/Oct/2026:17:42:31 (UTC) — matches the nginx access log format
  const d = new Date(ms);
  const mon = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}/${mon}/${d.getUTCFullYear()}:${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
};
const last10 = (p) => (p || '').replace(/\D/g, '').slice(-10);

async function fetchOrders(fromSec, toSec) {
  const all = [];
  for (let skip = 0; ; skip += 100) {
    const page = await razorpay.orders.all({ from: fromSec, to: toSec, count: 100, skip });
    all.push(...page.items);
    if (page.items.length < 100) break;
  }
  return all.sort((a, b) => a.created_at - b.created_at);
}

async function buyerStatus(email, phone) {
  const rows = await prisma.eventRegistration.findMany({
    where: {
      OR: [
        ...(email ? [{ guest_email: { equals: email, mode: 'insensitive' } }] : []),
        ...(phone ? [{ guest_phone: { contains: phone } }] : []),
      ],
    },
  });
  return rows.map((r) => `${r.status}${r.razorpay_order_id ? ` (${r.razorpay_order_id})` : ''}`).join(', ') || 'no registration row';
}

async function main() {
  const [from, to] = process.argv.slice(2);
  if (!from || !to) {
    console.error('Usage: node scripts/auditEventOrders.js <from YYYY-MM-DD> <to YYYY-MM-DD>');
    process.exit(1);
  }
  const fromSec = Math.floor(new Date(`${from}T00:00:00+05:30`).getTime() / 1000);
  const toSec = Math.floor(new Date(`${to}T23:59:59+05:30`).getTime() / 1000);

  const orders = await fetchOrders(fromSec, toSec);
  const regs = await prisma.eventRegistration.findMany({
    where: { razorpay_order_id: { in: orders.map((o) => o.id) } },
  });
  const courseOrders = await prisma.courseOrder.findMany({
    where: { razorpay_order_id: { in: orders.map((o) => o.id) } },
    select: { razorpay_order_id: true, status: true, buyer_email: true },
  });
  const regByOrder = new Map(regs.map((r) => [r.razorpay_order_id, r]));
  const courseByOrder = new Map(courseOrders.map((c) => [c.razorpay_order_id, c]));

  const summary = {};
  const orphanStamps = [];

  console.log(`Razorpay orders ${from} → ${to}: ${orders.length}\n`);
  for (const o of orders) {
    const reg = regByOrder.get(o.id);
    const course = courseByOrder.get(o.id);
    const dbState = reg
      ? `event reg ${reg.status} ${reg.guest_email || ''}`
      : course
        ? `COURSE order ${course.status} ${course.buyer_email || ''}`
        : 'NO DB ROW';
    const key = `${o.status} / ${reg ? reg.status : course ? 'course' : 'no row'}`;
    summary[key] = (summary[key] || 0) + 1;

    console.log(`${o.id}  ₹${o.amount / 100}  ${o.status.padEnd(9)} attempts=${o.attempts}  ${ist(o.created_at * 1000)}  → ${dbState}`);

    if (o.status === 'paid' && reg && reg.status === 'COMPLETED') continue; // healthy — keep output short

    const payments = o.attempts > 0 ? (await razorpay.orders.fetchPayments(o.id)).items || [] : [];
    for (const p of payments) {
      console.log(
        `    payment ${p.id} ${p.status} ${p.method}${p.vpa ? ' ' + p.vpa : ''} ${p.email || ''} ${p.contact || ''} at ${ist(p.created_at * 1000)}`
      );
      if (p.error_code) {
        console.log(`      error: ${p.error_code} | ${p.error_description} | source=${p.error_source} step=${p.error_step} reason=${p.error_reason}`);
      }
      if (p.email || p.contact) {
        console.log(`      buyer's registration rows now: ${await buyerStatus(p.email, last10(p.contact))}`);
      }
    }

    if (!reg && !course) {
      // No row references this order: find rows touched within ±3 min of it.
      const t = o.created_at * 1000;
      const near = await prisma.eventRegistration.findMany({
        where: {
          OR: [
            { created_at: { gte: new Date(t - 180000), lte: new Date(t + 180000) } },
            { updated_at: { gte: new Date(t - 180000), lte: new Date(t + 180000) } },
          ],
        },
      });
      for (const r of near) {
        console.log(
          `    nearby row: ${r.status} ${r.guest_email || '-'} order=${r.razorpay_order_id || '-'} created=${ist(r.created_at)} updated=${ist(r.updated_at)}`
        );
      }
      if (near.length === 0) console.log('    nearby row: none within ±3 min');
      orphanStamps.push(nginxStamp(t));
    }
  }

  const failedLeads = await prisma.lead.findMany({
    where: { status: 'payment_failed', created_at: { gte: new Date(fromSec * 1000), lte: new Date(toSec * 1000 + 86400000) } },
  });
  if (failedLeads.length) {
    console.log('\nLeads flagged payment_failed by the checkout (record-failure):');
    for (const l of failedLeads) console.log(`  ${l.email || '-'} ${l.phone || ''} source=${l.source} — ${l.message || ''}`);
  }

  console.log('\nSummary (Razorpay status / DB status):');
  for (const [k, v] of Object.entries(summary)) console.log(`  ${k.padEnd(28)} ${v}`);

  if (orphanStamps.length) {
    const minutes = Array.from(new Set(orphanStamps.map((s) => s.slice(0, 17)))); // to the minute
    console.log('\nTo see which visitor created the orders with no DB row, run:');
    console.log(`  sudo zgrep -h "/api/payments/" /var/log/nginx/access.log* | grep -E "${minutes.join('|')}"`);
  }
}

main()
  .catch((err) => console.error(err.error?.description || err.message))
  .finally(() => prisma.$disconnect());
