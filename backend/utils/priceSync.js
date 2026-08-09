/**
 * Price mirroring between the website builder and the LMS.
 *
 * WHY THIS EXISTS
 * The amount a buyer is CHARGED for a course comes from the LMS: the checkout
 * (`routes/coursePayments.js` → `getCourseBySlug`) reads `Course.price`
 * server-side and never trusts a client amount. The builder's pricing cards
 * held a second, independent copy of that number, which is what the page
 * DISPLAYS. Nothing kept them equal, so an admin editing the builder could
 * advertise ₹290 while checkout charged whatever the LMS still held.
 *
 * Both admin panels may now edit the price and the two are kept identical:
 *   LMS  → website  `routes/lmsEvents.js` (the existing signed resync) writes
 *                   the price leaf of matching pricing cards.
 *   website → LMS   `pushPricesToLms()` below posts to the LMS's signed
 *                   /api/internal/course-price endpoint.
 *
 * LOOP SAFETY: each side writes only when the value actually differs, so the
 * mirrored update on the far side is a no-op and the exchange stops after one
 * hop rather than ping-ponging.
 *
 * SCOPE NOTE: `lmsEvents.js` otherwise never writes `page_blocks` — the
 * landing-page design belongs to the website admin. The price leaf is a
 * deliberate, minimal exception: `pricing.actual_price` on cards that name a
 * course, and nothing else.
 */

const crypto = require('crypto');

/**
 * Walk whichever page_blocks shape this event uses and apply `fn(card)` to
 * every pricing card. Handles both the legacy array-of-blocks format and the
 * unified object format — mirrors the traversal in
 * `routes/payments.js` → getPriceFromEvent so the two cannot drift apart.
 *
 * Returns the number of cards visited.
 */
function forEachPricingCard(pageData, fn) {
  let visited = 0;
  const walk = (items) => {
    if (!Array.isArray(items)) return;
    for (const card of items) {
      if (card && typeof card === 'object') {
        fn(card);
        visited += 1;
      }
    }
  };

  if (Array.isArray(pageData)) {
    for (const block of pageData) {
      if (block && block.type === 'pricing' && block.data) walk(block.data.pricing_options);
      if (block && block.type === 'workshops' && block.data) walk(block.data.items);
    }
  } else if (pageData && typeof pageData === 'object') {
    walk(pageData.pricing_options);
    walk(pageData.workshops);
  }
  return visited;
}

/**
 * Set `pricing.actual_price` on every card that sells `courseSlug`.
 *
 * A card names its course with `course_slug`. Cards without one inherit the
 * event's own linked course, which is why `eventCourseSlug` is passed in —
 * it matches the resolution the storefront itself uses
 * (`DynamicSections.tsx`: `card?.course_slug || lmsCourseSlug`).
 *
 * Mutates pageData in place. Returns { changed, cards } so the caller can skip
 * a pointless database write when nothing moved.
 */
function applyPriceToPageBlocks(pageData, courseSlug, price, eventCourseSlug) {
  let changed = false;
  let cards = 0;

  forEachPricingCard(pageData, (card) => {
    const cardSlug = card.course_slug || eventCourseSlug || null;
    if (cardSlug !== courseSlug) return;
    cards += 1;

    if (!card.pricing || typeof card.pricing !== 'object') card.pricing = {};
    if (Number(card.pricing.actual_price) !== Number(price)) {
      card.pricing.actual_price = price;
      changed = true;
    }
  });

  return { changed, cards };
}

/** Every { slug, price } a builder page currently advertises. */
function collectPricesFromPageBlocks(pageData, eventCourseSlug) {
  const out = [];
  forEachPricingCard(pageData, (card) => {
    const slug = card.course_slug || eventCourseSlug || null;
    const price = card && card.pricing ? card.pricing.actual_price : null;
    if (!slug || price == null || price === '') return;
    const n = Number(price);
    if (!Number.isFinite(n) || n < 0) return;
    // Course.price is an Int in rupees; refuse to push a fractional amount
    // rather than let the LMS round someone's money.
    if (!Number.isInteger(n)) return;
    if (!out.some((e) => e.slug === slug)) out.push({ slug, price: n });
  });
  return out;
}

/**
 * Push prices to the LMS. Signed exactly like the enrolment webhook in
 * reverse: x-tss-signature = HMAC-SHA256(rawBody, LMS_WEBHOOK_SECRET).
 *
 * Fire-and-forget by design: a builder save must not fail because the LMS is
 * momentarily unreachable. Failures are logged loudly so a silent drift is
 * still visible in the logs.
 */
async function pushPricesToLms(prices) {
  if (!Array.isArray(prices) || prices.length === 0) return { ok: true, skipped: true };

  const secret = process.env.LMS_WEBHOOK_SECRET;
  const base = process.env.LMS_WEBHOOK_URL;
  if (!secret || !base) {
    console.warn('[priceSync] LMS_WEBHOOK_SECRET/LMS_WEBHOOK_URL not set — price not mirrored to the LMS');
    return { ok: false, error: 'not configured' };
  }

  // LMS_WEBHOOK_URL points at .../lms/api/webhooks/enrollment; the price
  // endpoint is a sibling under the same basePath.
  const url = base.replace(/\/api\/webhooks\/enrollment\/?$/, '/api/internal/course-price');

  const rawBody = JSON.stringify({ ts: Date.now(), prices });
  const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tss-signature': signature },
      body: rawBody,
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[priceSync] LMS rejected the price push:', res.status, body);
      return { ok: false, status: res.status, body };
    }
    if (Array.isArray(body.updated) && body.updated.length) {
      console.log('[priceSync] LMS prices updated:', body.updated.join(', '));
    }
    if (Array.isArray(body.missing) && body.missing.length) {
      console.warn('[priceSync] no LMS course for slug(s):', body.missing.join(', '));
    }
    return { ok: true, body };
  } catch (err) {
    console.error('[priceSync] could not reach the LMS:', err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = {
  forEachPricingCard,
  applyPriceToPageBlocks,
  collectPricesFromPageBlocks,
  pushPricesToLms,
};
