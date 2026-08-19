const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifySignedInternalRequest } = require('../utils/internalAuth');

// SSO-lite admin handoff (Unified Events WP-10).
//
// Lets an authenticated LMS admin jump into the website admin (the event
// builder) without a second login:
//   1. The LMS server (already gated by its own requireAdminUser) makes a
//      SIGNED request to /api/internal/admin-handoff → gets a ONE-TIME token
//      that expires in 60 seconds.
//   2. The browser opens /admin/handoff?token=…&next=… ; that page exchanges
//      the token at /api/admin/handoff-exchange for a normal website-admin
//      JWT and redirects into the admin.
//
// ⚠️ Access-widening by design (flagged to Madhwendra): any LMS admin can
// obtain website-admin access this way. Acceptable for this team — the same
// people run both admins. Every issuance and exchange is logged.
//
// Tokens are held in process memory: PM2 runs the backend as a single fork,
// and a lost token on restart just means clicking the button again. Move to
// the DB if the backend is ever clustered.

const tokens = new Map(); // token -> expiry (ms epoch)
const TOKEN_TTL_MS = 60 * 1000;

function pruneTokens() {
  const now = Date.now();
  for (const [token, expiry] of tokens) {
    if (expiry < now) tokens.delete(token);
  }
}

// The identity the exchanged JWT represents. Deterministic:
// ADMIN_HANDOFF_EMAIL env override → role 'admin' → the seeded admin
// account → the oldest account (the original admin predates the role column,
// so prod has no role='admin' rows).
async function findAdminUser() {
  if (process.env.ADMIN_HANDOFF_EMAIL) {
    const byEnv = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_HANDOFF_EMAIL },
    });
    if (byEnv) return byEnv;
  }
  const byRole = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (byRole) return byRole;
  // ⚠️ The two fallbacks below predate the 19 Aug role fix, when NO row had
  // role='admin' and any account could reach the CMS. They are kept so an
  // existing deployment does not break, but both now hit the role check above
  // and fail loudly rather than handing out a token that does not work.
  const seeded = await prisma.user.findUnique({
    where: { email: 'admin@thestartupschool.in' },
  });
  if (seeded) return seeded;
  return prisma.user.findFirst({ orderBy: { created_at: 'asc' } });
}

// ── Internal (LMS→website, HMAC-signed, RAW body) ─────────────────────────
// Mounted at /api/internal/admin-handoff BEFORE express.json().
const internalRouter = express.Router();
internalRouter.use(
  rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false })
);
internalRouter.use(express.raw({ type: () => true, limit: '16kb' }));

internalRouter.post('/', async (req, res) => {
  const auth = verifySignedInternalRequest(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }
  pruneTokens();
  const token = crypto.randomBytes(32).toString('hex');
  tokens.set(token, Date.now() + TOKEN_TTL_MS);
  console.log(`[admin-handoff] token issued for LMS admin "${auth.payload.requestedBy || 'unknown'}" at ${new Date().toISOString()}`);
  res.json({ token, expiresInSeconds: TOKEN_TTL_MS / 1000 });
});

// ── Public exchange (browser, JSON body) ──────────────────────────────────
// Mounted at /api/admin/handoff-exchange AFTER express.json().
const exchangeRouter = express.Router();
exchangeRouter.use(
  rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false })
);

exchangeRouter.post('/', async (req, res) => {
  try {
    const { token } = req.body || {};
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Missing token' });
    }
    pruneTokens();
    const expiry = tokens.get(token);
    tokens.delete(token); // single-use, valid or not
    if (!expiry || expiry < Date.now()) {
      return res.status(401).json({ error: 'This sign-in link has expired — go back to the LMS and click the button again' });
    }

    const admin = await findAdminUser();
    if (!admin) {
      return res.status(503).json({ error: 'No admin account available for handoff' });
    }

    // 🔴 Since 19 Aug 2026 the admin middleware checks role against the DB, so a
    // handoff into an account that is not role='admin' would mint a token that
    // is refused on the very next request — a confusing "logged in but nothing
    // works" state. Fail loudly here instead.
    if (admin.role !== 'admin') {
      console.error(`[admin-handoff] refused: ${admin.email} is role='${admin.role}', not 'admin'`);
      return res.status(503).json({
        error: 'The website admin account is not configured correctly — ask a developer to check ADMIN_HANDOFF_EMAIL',
      });
    }

    // Same shape /api/admin/login issues, but time-bounded.
    const adminJwt = jwt.sign({ id: admin.id, role: admin.role, handoff: true }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
    console.log(`[admin-handoff] token exchanged → admin session for ${admin.email} at ${new Date().toISOString()}`);
    res.json({ token: adminJwt });
  } catch (error) {
    console.error('[admin-handoff] exchange failed:', error);
    res.status(500).json({ error: 'Handoff failed' });
  }
});

module.exports = { internalRouter, exchangeRouter };
