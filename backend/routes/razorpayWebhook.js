const express = require('express');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
  completeEventRegistration,
  findRegistrationForOrder,
  fetchOrderNotes,
} = require('./payments');
const { fulfillOrder } = require('./coursePayments');

// POST /api/razorpay/webhook — Razorpay → website, server to server.
//
// Until this existed, a payment only reached our database if the BUYER'S
// BROWSER called /api/payments/verify-payment (or /api/course-payments/verify)
// after paying. On mobile UPI the tab is often lost while the buyer is in their
// UPI app, so a captured payment could stay PENDING forever with nobody told
// (incident 2026-10-02: 3 paid Bhubaneswar registrations). Razorpay now tells us
// directly; the browser call stays as the fast path. Both paths share one
// idempotent completion step, so whichever lands second is a no-op.
//
// Razorpay dashboard → Settings → Webhooks:
//   URL     https://setustartupschool.com/api/razorpay/webhook
//   Events  order.paid, payment.captured
//   Secret  same value as RAZORPAY_WEBHOOK_SECRET in backend/.env
//
// Auth: x-razorpay-signature = HMAC-SHA256 hex of the EXACT raw body, keyed
// with the webhook secret — so this router is mounted BEFORE the global
// express.json() in server.js.
//
// Status codes matter: Razorpay retries non-2xx for up to 24h. Transient
// failures (DB down) return 500 to get a retry; anything a retry cannot fix
// (unknown order, ignored event) returns 200 and is logged instead.

const router = express.Router();

const HANDLED_EVENTS = new Set(['order.paid', 'payment.captured']);

function safeEqualHex(expected, incoming) {
  if (typeof incoming !== 'string') return false;
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(incoming, 'hex');
  if (a.length !== b.length || a.length === 0) return false;
  return crypto.timingSafeEqual(a, b);
}

async function handleCapturedPayment(payment, orderEntity) {
  const orderId = payment.order_id;

  const courseOrder = await prisma.courseOrder.findUnique({ where: { razorpay_order_id: orderId } });
  if (courseOrder) {
    return (await fulfillOrder(courseOrder, payment.id)) ? 'course order fulfilled' : 'course order already paid';
  }

  // order.paid carries the order (Razorpay sends empty notes as []);
  // payment.captured does not, so fetch it.
  const notes = orderEntity
    ? (orderEntity.notes && !Array.isArray(orderEntity.notes) ? orderEntity.notes : {})
    : await fetchOrderNotes(orderId);

  const reg = await findRegistrationForOrder(orderId, notes);
  if (!reg) {
    console.error(
      `[razorpay-webhook] NO RECORD for captured payment ${payment.id} on ${orderId} ` +
      `(₹${payment.amount / 100}, ${payment.email || '-'}) — reconcile manually`
    );
    return 'no matching record (logged)';
  }

  if (reg.status === 'COMPLETED' && reg.razorpay_payment_id && reg.razorpay_payment_id !== payment.id) {
    console.error(
      `[razorpay-webhook] registration ${reg.id} is already COMPLETED with ${reg.razorpay_payment_id}; ` +
      `second payment ${payment.id} on ${orderId} may need a refund`
    );
    return 'duplicate payment (logged)';
  }

  const { completed } = await completeEventRegistration(reg, {
    orderId,
    paymentId: payment.id,
    couponCode: notes.coupon_code || null,
    contactEmail: payment.email || null,
    contactPhone: payment.contact || null,
  });
  return completed ? 'registration completed' : 'registration already completed';
}

router.post('/', express.raw({ type: () => true, limit: '256kb' }), async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET is not set — webhook rejected');
    return res.status(503).json({ error: 'Webhook not configured' });
  }

  const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (!safeEqualHex(expected, req.get('x-razorpay-signature'))) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  let evt;
  try {
    evt = JSON.parse(raw.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!HANDLED_EVENTS.has(evt.event)) {
    return res.json({ ignored: evt.event });
  }
  const payment = evt.payload?.payment?.entity;
  if (!payment || payment.status !== 'captured' || !payment.order_id) {
    return res.json({ ignored: 'not a captured order payment' });
  }

  try {
    const result = await handleCapturedPayment(payment, evt.payload?.order?.entity);
    console.log(`[razorpay-webhook] ${evt.event} ${payment.order_id} ${payment.id}: ${result}`);
    res.json({ ok: true, result });
  } catch (err) {
    console.error(`[razorpay-webhook] ${evt.event} ${payment.order_id} ${payment.id} failed (Razorpay will retry):`, err);
    res.status(500).json({ error: 'Processing failed' });
  }
});

module.exports = router;
