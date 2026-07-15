const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fires the signed enrollment webhook to the LMS after a successful payment.
//
// Contract (jj-lms/app/api/webhooks/enrollment/route.ts):
//   POST {LMS_WEBHOOK_URL}
//   header x-tss-signature: HMAC-SHA256 hex of the EXACT raw request body,
//   keyed with the shared secret. The body is serialized once and that same
//   string is both signed and sent — re-serializing would break the digest.
//
// Response semantics: 200 = enrolled; 409 = already enrolled (the receiver's
// idempotency guard) — both count as success so retries after a partial
// failure never double-enroll. Anything else is retried with backoff and
// every attempt is logged to WebhookDelivery for audit/manual replay.

const RETRY_DELAYS_MS = [1_000, 5_000, 30_000, 120_000, 600_000];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function signPayload(rawBody, secret) {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

async function sendOnce(order, attempt) {
  const payload = {
    email: order.buyerEmail,
    name: order.buyerName,
    courseId: order.lmsCourseId,
    paymentId: order.razorpayOrderId,
    // 'free' only for the self-serve free flow; omitted for paid orders
    // (the receiver defaults to 'paid' — backward compatible)
    paymentStatus: order.paymentStatus ?? undefined,
    utmSource: order.utmSource ?? undefined,
    utmMedium: order.utmMedium ?? undefined,
    utmCampaign: order.utmCampaign ?? undefined,
  };
  const rawBody = JSON.stringify(payload);
  const signature = signPayload(rawBody, process.env.LMS_WEBHOOK_SECRET);

  let statusCode = null;
  let responseBody = null;
  let errorMessage = null;
  let success = false;

  try {
    const res = await fetch(process.env.LMS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tss-signature': signature,
      },
      body: rawBody,
      signal: AbortSignal.timeout(15_000),
    });
    statusCode = res.status;
    responseBody = (await res.text()).slice(0, 2000);
    success = res.status === 200 || res.status === 409;
  } catch (err) {
    errorMessage = err.message;
  }

  await prisma.webhookDelivery.create({
    data: {
      order_id: order.id,
      attempt,
      status_code: statusCode,
      response_body: responseBody,
      error: errorMessage,
      delivered_at: success ? new Date() : null,
    },
  });

  return success;
}

// Retries in-process; if the process dies mid-backoff the order stays
// flagged webhook_pending and scripts/replayWebhook.js finishes the job.
async function sendEnrollmentWebhook(order) {
  for (let attempt = 1; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const success = await sendOnce(order, attempt);
    if (success) {
      await prisma.courseOrder.update({
        where: { id: order.id },
        data: { webhook_status: 'delivered' },
      });
      return true;
    }
    if (attempt < RETRY_DELAYS_MS.length) {
      await sleep(RETRY_DELAYS_MS[attempt - 1]);
    }
  }
  await prisma.courseOrder.update({
    where: { id: order.id },
    data: { webhook_status: 'failed' },
  });
  console.error(
    `Enrollment webhook failed after ${RETRY_DELAYS_MS.length} attempts for order ${order.id} — replay with: node scripts/replayWebhook.js ${order.id}`
  );
  return false;
}

module.exports = { sendEnrollmentWebhook, signPayload };
