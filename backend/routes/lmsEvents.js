const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// LMS → website sync for Unified Events.
//
// The LMS admin's "Publish to website" button POSTs here to create/update the
// marketing Event row for a course. Same auth contract as the enrollment
// webhook, reversed direction: x-tss-signature = HMAC-SHA256 hex of the EXACT
// raw request body, keyed with the shared secret (LMS_WEBHOOK_SECRET here ==
// WEBHOOK_SECRET on the LMS). The router therefore consumes the RAW body —
// it must be mounted BEFORE the global express.json() in server.js.
//
// Payload: { action, ts, courseSlug, eventId?, title, description?,
//            bannerUrl?, startDate?, endDate?, startTime?, endTime?,
//            allSessionsCompleted? }
//   action "publish"   → create the Event hidden (is_active=false) or update
//                        delivery-derived fields on the linked one.
//   action "golive"    → is_active = true  (page becomes public on /events)
//   action "unpublish" → is_active = false (page hidden; design preserved)
//
// Identity: eventId (stored LMS-side after first publish) wins, then
// lms_course_slug, then a plain slug match (attaches website-first events).
// The event's public slug is NEVER changed by a sync — marketing URLs stay
// stable even if the course slug is renamed; only the link + registration_url
// follow the rename. page_blocks is never written here: the landing-page
// design belongs to the website admin's builder.

const { getInternalSecret, verifySignedInternalRequest } = require('../utils/internalAuth');

const router = express.Router();

const PREVIEW_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

router.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many sync requests' },
  })
);

// Raw body — the signature covers these exact bytes.
router.use(express.raw({ type: () => true, limit: '128kb' }));

// Signed, expiring token that lets /events/[slug] render a HIDDEN event so
// admins can proof the landing page before "Go live". Format: "<expiry>.<hmac>".
function makePreviewToken(slug, secret) {
  const expiry = Date.now() + PREVIEW_TOKEN_TTL_MS;
  const digest = crypto
    .createHmac('sha256', secret)
    .update(`preview:${slug}:${expiry}`)
    .digest('hex');
  return `${expiry}.${digest}`;
}

function verifyPreviewToken(slug, token) {
  const secret = getInternalSecret();
  if (!secret || typeof token !== 'string') return false;
  const dotAt = token.indexOf('.');
  if (dotAt === -1) return false;
  const expiry = Number(token.slice(0, dotAt));
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`preview:${slug}:${expiry}`)
    .digest('hex');
  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(token.slice(dotAt + 1), 'utf8');
  return (
    expectedBuf.length === receivedBuf.length &&
    crypto.timingSafeEqual(expectedBuf, receivedBuf)
  );
}

router.post('/publish', async (req, res) => {
  try {
    const auth = verifySignedInternalRequest(req);
    if (!auth.ok) {
      return res.status(auth.status).json({ error: auth.error });
    }
    const payload = auth.payload;

    const {
      action = 'publish',
      eventId,
      courseSlug,
      title,
      description,
      bannerUrl,
      startDate,
      endDate,
      startTime,
      endTime,
      allSessionsCompleted,
    } = payload;

    if (!['publish', 'golive', 'unpublish'].includes(action)) {
      return res.status(400).json({ error: 'Unknown action' });
    }
    if (!courseSlug || typeof courseSlug !== 'string') {
      return res.status(400).json({ error: 'courseSlug is required' });
    }

    // Resolve the target: stored id → link column → plain slug (attach a
    // website-first event to its new course without duplicating it).
    let event = null;
    if (eventId) {
      event = await prisma.event.findUnique({ where: { id: eventId } });
    }
    if (!event) {
      event = await prisma.event.findFirst({ where: { lms_course_slug: courseSlug } });
    }
    if (!event) {
      event = await prisma.event.findFirst({ where: { slug: courseSlug } });
    }

    if (action === 'golive' || action === 'unpublish') {
      if (!event) {
        return res.status(404).json({ error: 'No linked event for this course' });
      }
      event = await prisma.event.update({
        where: { id: event.id },
        data: { is_active: action === 'golive', lms_course_slug: courseSlug },
      });
    } else {
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'title is required' });
      }
      // Delivery-derived fields only — page_blocks and the public slug are
      // deliberately absent (website-owned once the stub exists).
      const deliveryFields = {
        title: title.trim(),
        description: typeof description === 'string' ? description : '',
        registration_url: `/courses/${courseSlug}`,
        lms_course_slug: courseSlug,
        ...(bannerUrl ? { banner_url: bannerUrl } : {}),
        ...(startDate ? { start_date: new Date(startDate) } : {}),
        ...(endDate ? { end_date: new Date(endDate) } : {}),
        ...(startTime !== undefined ? { start_time: startTime || null } : {}),
        ...(endTime !== undefined ? { end_time: endTime || null } : {}),
        ...(typeof allSessionsCompleted === 'boolean' ? { is_past: allSessionsCompleted } : {}),
      };

      if (event) {
        event = await prisma.event.update({ where: { id: event.id }, data: deliveryFields });
      } else {
        event = await prisma.event.create({
          data: {
            ...deliveryFields,
            slug: courseSlug,
            is_active: false, // hidden until "Go live" — admin-only stub
          },
        });
      }
    }

    const previewToken = makePreviewToken(event.slug, getInternalSecret());
    res.json({
      eventId: event.id,
      slug: event.slug,
      isActive: event.is_active,
      isPast: event.is_past,
      previewUrl: `/events/${event.slug}?preview=${previewToken}`,
    });
  } catch (error) {
    console.error('[lms-events] sync failed:', error);
    res.status(500).json({ error: 'Failed to sync event' });
  }
});

module.exports = { router, verifyPreviewToken };
