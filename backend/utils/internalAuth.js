const crypto = require('crypto');

// Shared verification for LMS→website internal endpoints (Unified Events).
// Contract: x-tss-signature = HMAC-SHA256 hex of the EXACT raw request body,
// keyed with the shared secret (LMS_WEBHOOK_SECRET == LMS WEBHOOK_SECRET),
// and a `ts` field inside the signed JSON payload as a replay guard.
// Routers using this must consume the RAW body (express.raw), i.e. be
// mounted BEFORE the global express.json() in server.js.

const SIGNATURE_HEADER = 'x-tss-signature';
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

function getInternalSecret() {
  const secret = process.env.LMS_WEBHOOK_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

// Returns { ok: true, payload } or { ok: false, status, error }.
function verifySignedInternalRequest(req) {
  const secret = getInternalSecret();
  if (!secret) {
    return { ok: false, status: 503, error: 'Internal API is not configured' };
  }

  const received = req.headers[SIGNATURE_HEADER];
  if (!received || !Buffer.isBuffer(req.body)) {
    return { ok: false, status: 401, error: 'Invalid signature' };
  }
  const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(String(received), 'utf8');
  const signatureValid =
    expectedBuf.length === receivedBuf.length &&
    crypto.timingSafeEqual(expectedBuf, receivedBuf);
  if (!signatureValid) {
    return { ok: false, status: 401, error: 'Invalid signature' };
  }

  let payload;
  try {
    payload = JSON.parse(req.body.toString('utf8'));
  } catch {
    return { ok: false, status: 400, error: 'Invalid JSON body' };
  }

  if (typeof payload.ts !== 'number' || Math.abs(Date.now() - payload.ts) > MAX_CLOCK_SKEW_MS) {
    return { ok: false, status: 401, error: 'Stale or missing timestamp' };
  }

  return { ok: true, payload };
}

module.exports = { getInternalSecret, verifySignedInternalRequest };
