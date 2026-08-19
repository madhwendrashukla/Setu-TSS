const express = require('express');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifySignedInternalRequest } = require('../utils/internalAuth');

// LMS → website admin sync (19 Aug 2026).
//
// An LMS admin or super-admin gets a matching website account with the SAME
// email and the SAME password, so one credential opens both admin panels.
// Same auth contract as the sibling internal routes: x-tss-signature =
// HMAC-SHA256 of the EXACT raw body, plus a signed `ts` replay guard. Mounted
// BEFORE express.json(), because the signature covers the raw bytes.
//
// ⚠️ THE PASSWORD IS SENT AS AN ALREADY-BCRYPTED HASH, never in plain text.
// The LMS hashes with bcryptjs at cost 10 and so does this site, so the hash
// verifies here unchanged — "same password" without either system ever
// transmitting or storing the password itself.
//
// ⚠️ THE COPY GOES STALE IF IT IS NOT RE-SENT. A password changed in the LMS
// does not reach here on its own, which is why the LMS calls this again on
// every password reset as well as on every role change. If those two hooks are
// ever removed, the two credentials silently diverge and nobody notices until
// somebody cannot log in.
//
// 🔴 REVOKE DOWNGRADES, IT DOES NOT DELETE. The website row may own
// registrations and leads through foreign keys, and it may predate the LMS
// account entirely (the two original admins did). Dropping to role='user'
// removes CMS access while leaving that history intact.

const router = express.Router();

router.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60, // same ceiling as the sibling internal routes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many admin sync requests' },
  })
);

// Raw body — the signature covers these exact bytes.
router.use(express.raw({ type: () => true, limit: '16kb' }));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// bcrypt hashes only. Refusing anything else is what stops a caller storing a
// plaintext password in the password column, where bcrypt.compare would then
// never match and the account would be quietly unusable.
const BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

router.post('/sync', async (req, res) => {
  const check = verifySignedInternalRequest(req);
  if (!check.ok) return res.status(check.status).json({ error: check.error });

  let body;
  try {
    body = JSON.parse(req.body.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Body must be JSON' });
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  const name = String(body.name ?? '').trim().slice(0, 120) || null;
  const grant = body.grant === true;
  const passwordHash = String(body.passwordHash ?? '');

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!grant) {
      if (!existing) return res.json({ ok: true, action: 'noop', detail: 'no website account' });
      if (existing.role !== 'admin') {
        return res.json({ ok: true, action: 'noop', detail: 'already not an admin' });
      }
      await prisma.user.update({ where: { email }, data: { role: 'user' } });
      console.log(`[admin-sync] revoked website admin for ${email}`);
      return res.json({ ok: true, action: 'revoked' });
    }

    // Granting. A hash is required to CREATE (the column is NOT NULL and an
    // account with no usable password cannot be logged into), but optional on
    // update — a role change should not blank an existing password.
    if (passwordHash && !BCRYPT_RE.test(passwordHash)) {
      return res.status(400).json({ error: 'passwordHash must be a bcrypt hash' });
    }

    if (!existing) {
      if (!passwordHash) {
        return res.status(400).json({ error: 'passwordHash is required to create a website account' });
      }
      await prisma.user.create({
        data: { email, name, password: passwordHash, role: 'admin' },
      });
      console.log(`[admin-sync] created website admin for ${email}`);
      return res.json({ ok: true, action: 'created' });
    }

    await prisma.user.update({
      where: { email },
      data: {
        role: 'admin',
        ...(name ? { name } : {}),
        ...(passwordHash ? { password: passwordHash } : {}),
      },
    });
    console.log(`[admin-sync] granted website admin for ${email}`);
    return res.json({ ok: true, action: 'updated' });
  } catch (err) {
    console.error('[admin-sync] failed:', err.message);
    return res.status(500).json({ error: 'Admin sync failed' });
  }
});

module.exports = { router };
