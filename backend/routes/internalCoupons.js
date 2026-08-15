const express = require('express');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// LMS → website coupon writes (admin panel review, item 11).
//
// The LMS admin reads coupons directly over the SELECT-only `lms_ro` Postgres
// role, so its /admin/coupons screen has always been read-only. This is the
// write half: same auth contract as the enrollment webhook and the Unified
// Events sync — x-tss-signature = HMAC-SHA256 hex of the EXACT raw request
// body, keyed with the shared secret, plus a signed `ts` replay guard. The
// router therefore consumes the RAW body and MUST be mounted BEFORE the global
// express.json() in server.js.
//
// TWO RULES THIS FILE EXISTS TO ENFORCE (decided 13 Aug):
//
//   1. The website stays the ONLY store of coupon data. The LMS never mirrors a
//      coupon into its own tables, so there is no second copy to drift. That is
//      what makes this safer than the price-sync precedent, where two stores of
//      the same number disagreed.
//   2. ALL validation lives here, server-side. The LMS form is an input surface
//      and nothing more — it does not re-implement expiry, usage caps or
//      per-user caps, because a rule implemented twice is a rule that will
//      eventually be enforced in only one place.
//
// DELIBERATELY NOT IMPLEMENTED: delete. `CouponUsage` cascades on delete, so
// removing a coupon would silently destroy the redemption history that the LMS
// dashboard's revenue figures are computed from. Switching `is_active` off is
// the reversible equivalent and is what the UI offers instead.

const { verifySignedInternalRequest } = require('../utils/internalAuth');

const router = express.Router();

router.use(
  rateLimit({
    windowMs: 60 * 1000,
    // Same ceiling as the sibling internal route (lmsEvents). Coupon saves are
    // far lower-volume than event syncs, but a second, different number here
    // would be one nobody could justify later.
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many coupon requests' },
  })
);

// Raw body — the signature covers these exact bytes.
router.use(express.raw({ type: () => true, limit: '64kb' }));

// Codes are stored upper-case and compared upper-case everywhere on the
// checkout path, so the shape is constrained to what survives that round trip.
const CODE_RE = /^[A-Z0-9][A-Z0-9_-]{2,31}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Deliberately loose: this is a sanity check against typos, not an attempt to
// decide what a valid address is.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_FIXED_DISCOUNT = 100000; // ₹1,00,000 — catches "50000" typed for "500"
const MAX_ALLOWLIST = 200;

// `type` carries the UNIT of discount_value: a percent for 'percentage',
// rupees for anything else. Only 'percentage' is ever compared anywhere on the
// checkout path (backend/utils/coupons.js, routes/payments.js), so 'fixed' and
// the older 'flat' rows behave identically — 'flat' is accepted for the
// existing rows that use it and normalised to the canonical 'fixed'.
function normaliseType(raw) {
  if (raw === 'percentage') return 'percentage';
  if (raw === 'fixed' || raw === 'flat') return 'fixed';
  return null;
}

// Returns { ok: true, value } or { ok: false, error }. `null` clears the field.
function optionalPositiveInt(raw, label) {
  if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    return { ok: false, error: `${label} must be a whole number of at least 1, or left empty for no limit.` };
  }
  return { ok: true, value: n };
}

function optionalDate(raw, label) {
  if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return { ok: false, error: `${label} is not a valid date.` };
  return { ok: true, value: d };
}

// The single authority on what a coupon may contain. Both create and update go
// through it, so the two paths cannot drift apart.
function validateCouponInput(payload) {
  const code = typeof payload.code === 'string' ? payload.code.trim().toUpperCase() : '';
  if (!code) return { ok: false, error: 'Enter a coupon code.' };
  if (!CODE_RE.test(code)) {
    return {
      ok: false,
      error: 'The code must be 3–32 characters: letters, numbers, hyphens and underscores only, starting with a letter or number.',
    };
  }

  const type = normaliseType(payload.type);
  if (!type) return { ok: false, error: 'Choose a discount type — percentage or fixed amount.' };

  const discountValue = Number(payload.discount_value);
  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    return { ok: false, error: 'The discount must be greater than zero.' };
  }
  if (type === 'percentage' && discountValue > 100) {
    return { ok: false, error: 'A percentage discount cannot be more than 100%.' };
  }
  if (type === 'fixed' && discountValue > MAX_FIXED_DISCOUNT) {
    return { ok: false, error: `A fixed discount cannot be more than ₹${MAX_FIXED_DISCOUNT.toLocaleString('en-IN')}.` };
  }

  const start = optionalDate(payload.start_date, 'The start date');
  if (!start.ok) return start;
  const end = optionalDate(payload.end_date, 'The end date');
  if (!end.ok) return end;
  if (start.value && end.value && end.value < start.value) {
    return { ok: false, error: 'The end date cannot be before the start date.' };
  }

  const maxUses = optionalPositiveInt(payload.max_uses, 'The total usage limit');
  if (!maxUses.ok) return maxUses;
  const maxPerUser = optionalPositiveInt(payload.max_uses_per_user, 'The per-person limit');
  if (!maxPerUser.ok) return maxPerUser;

  // Trimmed but NOT case-folded: checkout compares the buyer's email against
  // this list with a plain includes(), so changing the case here would silently
  // stop an existing allowlist from matching.
  let emails = [];
  if (payload.applicable_emails !== undefined && payload.applicable_emails !== null) {
    if (!Array.isArray(payload.applicable_emails)) {
      return { ok: false, error: 'The email allowlist must be a list.' };
    }
    emails = payload.applicable_emails
      .map((e) => (typeof e === 'string' ? e.trim() : ''))
      .filter((e) => e.length > 0);
    if (emails.length > MAX_ALLOWLIST) {
      return { ok: false, error: `The email allowlist cannot hold more than ${MAX_ALLOWLIST} addresses.` };
    }
    const bad = emails.find((e) => !EMAIL_RE.test(e));
    if (bad) return { ok: false, error: `“${bad}” is not a valid email address.` };
  }

  let referrerId = null;
  if (payload.referrer_id) {
    if (typeof payload.referrer_id !== 'string' || !UUID_RE.test(payload.referrer_id)) {
      return { ok: false, error: 'The referrer id must be a UUID.' };
    }
    referrerId = payload.referrer_id;
  }

  return {
    ok: true,
    // NOTE the absence of `current_uses`. It is the redemption counter and only
    // recordCouponUsage() may move it — accepting it here would let an edit
    // rewrite how many times a coupon has been redeemed, and with it the
    // revenue figures the LMS reads back out of the order ledger.
    data: {
      code,
      type,
      discount_value: discountValue,
      is_active: payload.is_active !== false,
      start_date: start.value,
      end_date: end.value,
      max_uses: maxUses.value,
      max_uses_per_user: maxPerUser.value,
      applicable_emails: emails,
      referrer_id: referrerId,
    },
  };
}

// Everything the LMS needs to render the row back, and nothing it does not.
function present(coupon) {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    discount_value: coupon.discount_value,
    is_active: coupon.is_active,
    start_date: coupon.start_date,
    end_date: coupon.end_date,
    max_uses: coupon.max_uses,
    current_uses: coupon.current_uses,
    max_uses_per_user: coupon.max_uses_per_user,
    // The column is nullable, so a legacy row can hold NULL rather than {}.
    applicable_emails: coupon.applicable_emails ?? [],
    referrer_id: coupon.referrer_id,
  };
}

// A full replace, not a patch: the LMS form always submits every field, so an
// absent field means "cleared" rather than "unchanged". That is the predictable
// reading, and it is why there is no separate partial-update path.
router.post('/save', async (req, res) => {
  try {
    const auth = verifySignedInternalRequest(req);
    if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

    const { action, id } = auth.payload;
    if (action !== 'create' && action !== 'update') {
      return res.status(400).json({ error: 'Unknown action' });
    }

    const validated = validateCouponInput(auth.payload);
    if (!validated.ok) return res.status(400).json({ error: validated.error });
    const data = validated.data;

    if (action === 'update') {
      if (typeof id !== 'string' || !UUID_RE.test(id)) {
        return res.status(400).json({ error: 'A coupon id is required to edit.' });
      }
      const existing = await prisma.coupon.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: 'That coupon no longer exists.' });

      // Uniqueness is enforced by a DB constraint too; checking first turns a
      // 500 into a sentence the admin can act on.
      if (data.code !== existing.code) {
        const clash = await prisma.coupon.findUnique({ where: { code: data.code } });
        if (clash) return res.status(409).json({ error: `The code ${data.code} is already in use.` });
      }

      const updated = await prisma.coupon.update({ where: { id }, data });
      console.log(`[internal-coupons] updated ${updated.code} (${updated.id})`);
      return res.json({ coupon: present(updated) });
    }

    const clash = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (clash) return res.status(409).json({ error: `The code ${data.code} is already in use.` });

    const created = await prisma.coupon.create({ data });
    console.log(`[internal-coupons] created ${created.code} (${created.id})`);
    return res.status(201).json({ coupon: present(created) });
  } catch (error) {
    // P2002 = unique constraint. Two admins racing on the same new code land
    // here rather than on the check above.
    if (error && error.code === 'P2002') {
      return res.status(409).json({ error: 'That code is already in use.' });
    }
    console.error('[internal-coupons] save failed:', error);
    return res.status(500).json({ error: 'Failed to save the coupon' });
  }
});

module.exports = { router, validateCouponInput };
