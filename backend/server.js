const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const { upload, compressImage } = require('./utils/upload');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.disable('x-powered-by'); // Production hygiene: remove Express signature

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));

// LMS→website internal endpoints for Unified Events. Mounted BEFORE
// express.json() because their HMAC signatures cover the exact raw body.
const lmsEventsSync = require('./routes/lmsEvents');
const adminHandoff = require('./routes/adminHandoff');
const internalCoupons = require('./routes/internalCoupons');
app.use('/api/internal/lms-events', lmsEventsSync.router);
app.use('/api/internal/admin-handoff', adminHandoff.internalRouter);
// Coupon writes for the LMS admin panel (item 11). The LMS reads coupons over
// the SELECT-only lms_ro role, so every write arrives here instead.
app.use('/api/internal/coupons', internalCoupons.router);
const internalAdmins = require('./routes/internalAdmins');
// Mounted BEFORE express.json() — the signature covers the raw bytes.
app.use('/api/internal/admins', internalAdmins.router);

// Limit request body to 1 MB to prevent large JSON string attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Browser side of the SSO-lite handoff (parsed JSON body).
app.use('/api/admin/handoff-exchange', adminHandoff.exchangeRouter);
// Serve uploaded images statically (Removed - now using AWS S3)
// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- AUTH API ---
app.post('/api/admin/login', async (req, res) => {
  // 🔴 SECURITY FIX, 19 Aug 2026. This used to verify the password and nothing
  // else — no role check — so any account in `users` could log into the CMS,
  // and public signup (/api/auth/signup) hands out accounts to anyone.
  //
  // The role check is deliberately AFTER the password check and returns the
  // same 401 with the same message: telling a non-admin "you are not an admin"
  // confirms the password was right, which is a free credential oracle.
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  const isValid = user && await bcrypt.compare(password, user.password);
  if (!isValid || user.role !== 'admin') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get('/api/admin/verify', authMiddleware, (req, res) => {
  res.json({ valid: true });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const paymentsRoutes = require('./routes/payments');
app.use('/api/payments', paymentsRoutes);

// --- TOOLS & RESOURCES ROUTES ---
const pitchDecksRoutes = require('./routes/pitchDecks');
const grantsRoutes = require('./routes/grants');
const investorsRoutes = require('./routes/investors');
const incubatorsRoutes = require('./routes/incubators');
const founderEventsRoutes = require('./routes/founderEvents');

app.use('/api/tools/pitch-decks', pitchDecksRoutes);
app.use('/api/tools/grants', grantsRoutes);
app.use('/api/tools/investors', investorsRoutes);
app.use('/api/tools/incubators', incubatorsRoutes);
app.use('/api/tools/founder-events', founderEventsRoutes);

const chatWidgetsRoutes = require('./routes/chatWidgets');
const helpdeskRoutes = require('./routes/helpdesk');
const couponsRoutes = require('./routes/coupons');
app.use('/api/chat-widgets', chatWidgetsRoutes);
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api/coupons', couponsRoutes);

// --- LMS INTEGRATION ---
// Courses are owned by the LMS (jjlms database, read-only role here);
// course payments are processed here, then a signed webhook enrolls the
// student in the LMS. See deploy/sql/ for the course_orders/webhook_deliveries DDL.
//
// NOTE: /api/payments (routes/payments.js) is the EVENT-registration payment
// system (EventRegistration model). Course payments live on a SEPARATE
// endpoint /api/course-payments (routes/coursePayments.js) so the two payment
// flows don't collide. Both use Razorpay but for different products.
const coursesRoutes = require('./routes/courses');
const coursePaymentsRoutes = require('./routes/coursePayments');
app.use('/api/courses', coursesRoutes);
app.use('/api/course-payments', coursePaymentsRoutes);

// --- PUBLIC API ENDPOINTS ---
// Fields safe to hand to a browser. Deliberately WITHOUT `page_blocks` — it is
// ~13 KB per event and carries `coupon` / `applicable_coupons`, which the
// by-slug endpoint strips before responding. Do not add them here.
//
// The admin event builder needs the full row, so `GET /api/events?all=true`
// skips this projection for an authenticated admin — see the note there.
const eventListSelection = {
  id: true, title: true, description: true, banner_url: true,
  venue: true, city: true, start_date: true, start_time: true,
  end_date: true, end_time: true, registration_url: true,
  is_past: true, is_pinned: true, is_active: true, slug: true,
  created_at: true
};

app.get('/api/events/pinned', async (req, res) => {
  try {
    const pinnedEvents = await prisma.event.findMany({ 
      where: { is_pinned: true, is_past: false, is_active: true },
      orderBy: { start_date: 'asc' },
      select: eventListSelection
    });
    res.json(pinnedEvents);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch pinned events' }); }
});

app.get('/api/events/past-rolling', async (req, res) => {
  try {
    const pastEvents = await prisma.event.findMany({ 
      where: { is_past: true, is_active: true }, 
      orderBy: { start_date: 'desc' },
      select: eventListSelection
    });
    res.json(pastEvents);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch past events' }); }
});

// With ?all=true and a valid admin JWT, inactive (hidden) events are included —
// the admin list/builder need to see LMS-published stubs before "Go live".
function hasValidAdminToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

app.get('/api/events', async (req, res) => {
  try {
    const { upcoming, past, all } = req.query;
    let whereClause = { is_active: true };
    const isAdminList = all === 'true' && hasValidAdminToken(req);
    if (isAdminList) whereClause = {};
    if (upcoming === 'true') whereClause.is_past = false;
    if (past === 'true') whereClause.is_past = true;
    // An authenticated admin gets the WHOLE row. The event builder loads from
    // this endpoint and edits `page_blocks`; under the public projection it
    // received a row with no `page_blocks` at all, silently fell back to its
    // empty defaults, and every section rendered blank — with a Save button
    // that would then write those defaults over the live page.
    // Public callers keep the lean projection.
    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { start_date: 'asc' },
      ...(isAdminList ? {} : { select: eventListSelection })
    });
    res.json(events);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch events' }); }
});

app.get('/api/events/slug/:slug', async (req, res) => {
  try {
    // A valid signed preview token (issued by the LMS publish sync) lets
    // admins render a HIDDEN event's landing page before "Go live".
    const preview =
      typeof req.query.preview === 'string' &&
      lmsEventsSync.verifyPreviewToken(req.params.slug, req.query.preview);
    const event = await prisma.event.findUnique({
      where: preview
        ? { slug: req.params.slug }
        : { slug: req.params.slug, is_active: true },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Security: Filter out sensitive business logic and internal routing data
    if (event.lms_course_slug !== undefined) delete event.lms_course_slug;
    
    if (event.page_blocks) {
        const blocks = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : event.page_blocks;
        if (blocks.coupon) delete blocks.coupon;
        if (blocks.applicable_coupons) delete blocks.applicable_coupons;
        event.page_blocks = blocks;
    }

    res.json(event);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch event by slug' }); }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const galleryItems = await prisma.galleryItem.findMany({ 
      where: { is_active: true }, 
      orderBy: { display_order: 'asc' } 
    });
    res.json(galleryItems);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch gallery items' }); }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    let testimonials = await prisma.testimonial.findMany({ 
      where: { is_active: true }, orderBy: { display_order: 'asc' } 
    });
    testimonials = testimonials.filter(t => 
        !((t.video_url && t.video_url.includes('dQw4w9WgXcQ')) || 
          (t.quote && t.quote.includes('jghgf')))
    );
    res.json(testimonials);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch testimonials' }); }
});

app.get('/api/mentors', async (req, res) => {
  try {
    const mentors = await prisma.mentor.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' } });
    res.json(mentors);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch mentors' }); }
});

app.get('/api/mentors/:id', async (req, res) => {
  try {
    const mentor = await prisma.mentor.findUnique({ where: { id: req.params.id, is_active: true } });
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    res.json(mentor);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch mentor details' }); }
});

app.get('/api/promo-bar', async (req, res) => {
  try {
    const promo = await prisma.promoBar.findFirst({ 
      where: { is_active: true },
      orderBy: { updated_at: 'desc' }
    });
    res.json(promo);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch promo bar' }); }
});
app.get('/api/homepage', async (req, res) => {
  try {
    const [heroSlides, homepageContent, programs, galleryItems, testimonials, partners, siteSettings, mentors, mentoredStartups, bottomVideos] = await Promise.all([
      prisma.heroSlide.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.homepageContent.findFirst(),
      prisma.program.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.galleryItem.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.testimonial.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.communityPartner.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.siteSetting.findFirst(),
      prisma.mentor.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.mentoredStartup.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.bottomVideoGallery.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }})
    ]);
    
    const isGibberish = (str) => str && (str.includes('jghgf') || str.includes('sdfgh') || str.includes('asdf') || str === 'jhg');
    const filteredTestimonials = testimonials.filter(t => 
        !((t.youtube_url && (t.youtube_url.includes('dQw4w9WgXcQ') || t.youtube_url.includes('jNQXAC9IVRw'))) || 
          isGibberish(t.quote) || isGibberish(t.name) || isGibberish(t.video_heading))
    );

    res.json({ heroSlides, homepageContent, programs, galleryItems, testimonials: filteredTestimonials, partners, siteSettings, mentors, mentoredStartups, bottomVideos });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch homepage data' }); 
  }
});

// Utility: strip HTML/script injection chars and enforce max length
function sanitizeField(str, maxLen = 200) {
  if (!str || typeof str !== 'string') return null;
  return str.replace(/[<>"'`]/g, '').trim().slice(0, maxLen);
}

app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, city, message, source } = req.body;

    // Server-side sanitisation (XSS + length guards)
    const cleanName    = sanitizeField(name,    100);
    const cleanEmail   = sanitizeField(email,   200);
    const cleanPhone   = sanitizeField(phone,    20);
    const cleanCity    = sanitizeField(city,    100);
    const cleanMessage = sanitizeField(message, 2000);
    const cleanSource  = sanitizeField(source,   80);

    if (!cleanName || !cleanEmail) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    // Strict Input Boundary Validation: Reject special characters in Name & City
    const strictCharRegex = /[@#$<>\[\]\/]/;
    if (strictCharRegex.test(name)) {
      return res.status(400).json({ error: 'Name contains invalid special characters' });
    }
    if (city && strictCharRegex.test(city)) {
      return res.status(400).json({ error: 'City contains invalid special characters' });
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    // Phone must be digits only (if supplied)
    if (cleanPhone && !/^\d{7,15}$/.test(cleanPhone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const newLead = await prisma.lead.create({
      data: {
        full_name: cleanName,
        email:     cleanEmail,
        phone:     cleanPhone  || null,
        city:      cleanCity   || null,
        message:   cleanMessage|| null,
        source:    cleanSource || 'contact_form',
        status:    'new',
      }
    });
    res.json({ success: true, id: newLead.id });
  } catch (error) { 
    console.error('Failed to create lead:', error);
    res.status(500).json({ error: 'Failed to submit form' }); 
  }
});

// --- ADMIN API ENDPOINTS (Protected) ---
app.use('/api/admin', authMiddleware);

const adminHelpdeskRoutes = require('./routes/adminHelpdesk');
app.use('/api/admin/helpdesk', adminHelpdeskRoutes);

app.post('/api/admin/upload', upload.single('file'), compressImage, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: req.file.url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// EVENTS
//
// Columns on tss_events that the admin form is allowed to write. The body is
// filtered against this list rather than spread straight into Prisma: the
// multipart form posts fields that are NOT columns (most notably `banner`,
// which is the file input's own name and arrives as an empty string when no
// image is chosen), and Prisma rejects the whole write with
// "Unknown argument `banner`" -> a 500 and no event created.
// Whitelisting also means a new form field can never break event saving again.
const EVENT_FIELDS = [
  'title', 'description', 'banner_url', 'venue', 'city',
  'start_date', 'start_time', 'end_date', 'end_time',
  'registration_url', 'is_past', 'is_pinned', 'is_active',
  'slug', 'page_blocks', 'lms_course_slug',
];

function buildEventData(body, file) {
  const data = {};
  for (const key of EVENT_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (file) data.banner_url = file.url;

  // multipart sends everything as strings
  for (const flag of ['is_past', 'is_pinned', 'is_active']) {
    if (data[flag] !== undefined) data[flag] = (data[flag] === 'true' || data[flag] === true);
  }
  if (data.start_date) data.start_date = new Date(data.start_date);
  if (data.end_date) data.end_date = new Date(data.end_date);
  if (data.page_blocks && typeof data.page_blocks === 'string') {
    try { data.page_blocks = JSON.parse(data.page_blocks); } catch (e) {}
  }
  // Optional unique columns: an empty string would collide on the second
  // event that also leaves them blank, so store NULL instead.
  for (const uniq of ['slug', 'lms_course_slug']) {
    if (data[uniq] === '') data[uniq] = null;
  }
  return data;
}

app.post('/api/admin/events', upload.single('banner'), compressImage, async (req, res) => {
  try {
    const data = buildEventData(req.body, req.file);
    data.is_pinned = data.is_pinned === true;

    const newEvent = await prisma.event.create({ data });
    // No visibility push on create: a new event's LMS link is established by
    // the LMS's own sync, and asserting visibility here would state something
    // nobody asked us to change.

    // ── Price mirroring (website → LMS) ─────────────────────────────────
    // The builder card is what the buyer SEES; Course.price in the LMS is what
    // checkout actually CHARGES. Push any price typed here into the LMS so the
    // two cannot disagree. Fire-and-forget: a save must not fail because the
    // LMS is briefly unreachable, and the LMS skips values that already match,
    // so this cannot bounce back and forth.
    try {
      const raw = newEvent.page_blocks;
      const pageData = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const prices = collectPricesFromPageBlocks(pageData, newEvent.lms_course_slug || null);
      if (prices.length) void pushPricesToLms(prices);
    } catch (err) {
      console.error('[priceSync] could not read prices from the builder page:', err.message);
    }
    res.json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/admin/events/:id', upload.single('banner'), compressImage, async (req, res) => {
  try {
    // Same whitelist as create — see EVENT_FIELDS above.
    const data = buildEventData(req.body, req.file);

    // Needed to tell an actual visibility change from an unrelated save.
    const before = await prisma.event.findUnique({
      where: { id: req.params.id },
      select: { is_active: true },
    });

    const updated = await prisma.event.update({ where: { id: req.params.id }, data });

    // ── Visibility mirroring (website → LMS) ───────────────────────────
    // ONLY when this request actually flipped is_active.
    //
    // is_active and Course.websiteLive are related but NOT identical:
    //   is_active   — is this EVENT listed on /events?
    //   websiteLive — is this COURSE listed in the /events catalogue grid?
    //
    // They legitimately differ. The AI Startup Launchpad runs is_active=true
    // with websiteLive=false on purpose, so the event card shows while the
    // course stays out of the grid — without that, /events lists the same
    // offering twice. Mirroring on every save would silently undo it the next
    // time anyone edited the page for an unrelated reason.
    try {
      const flipped =
        typeof data.is_active === 'boolean' && before && before.is_active !== updated.is_active;
      if (flipped && updated.lms_course_slug) {
        void pushVisibilityToLms([
          { slug: updated.lms_course_slug, websiteLive: updated.is_active },
        ]);
      }
    } catch (err) {
      console.error('[visibilitySync] could not mirror visibility:', err.message);
    }

    // ── Price mirroring (website → LMS) ─────────────────────────────────
    // The builder card is what the buyer SEES; Course.price in the LMS is what
    // checkout actually CHARGES. Push any price typed here into the LMS so the
    // two cannot disagree. Fire-and-forget: a save must not fail because the
    // LMS is briefly unreachable, and the LMS skips values that already match,
    // so this cannot bounce back and forth.
    try {
      const raw = updated.page_blocks;
      const pageData = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const prices = collectPricesFromPageBlocks(pageData, updated.lms_course_slug || null);
      if (prices.length) void pushPricesToLms(prices);
    } catch (err) {
      console.error('[priceSync] could not read prices from the builder page:', err.message);
    }
    res.json(updated);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Failed to update event' }); 
  }
});

app.delete('/api/admin/events/:id', async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete event' }); }
});

// GALLERY
app.post('/api/admin/gallery', upload.single('media'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.media_url = req.file.url;
    data.display_order = parseInt(data.display_order) || 0;

    if (data.display_order === 0) {
      // Auto order
      const maxOrder = await prisma.galleryItem.aggregate({
        _max: { display_order: true }
      });
      data.display_order = (maxOrder._max.display_order || 0) + 1;
    } else {
      // Order validation
      const existing = await prisma.galleryItem.findFirst({
        where: { display_order: data.display_order }
      });
      if (existing) {
        return res.status(400).json({ error: `Display Order ${data.display_order} is already in use.` });
      }
    }

    // Enforce limits
    const activeImages = await prisma.galleryItem.count({ where: { type: 'image', is_active: true } });
    const activeVideos = await prisma.galleryItem.count({ where: { type: 'video', is_active: true } });
    
    if (data.type === 'image' && activeImages >= 20) {
      return res.status(400).json({ error: 'Maximum 20 images allowed.' });
    }
    if (data.type === 'video' && activeVideos >= 10) {
      return res.status(400).json({ error: 'Maximum 10 videos allowed.' });
    }
    if ((activeImages + activeVideos) >= 30) {
      return res.status(400).json({ error: 'Maximum 30 items allowed in total.' });
    }

    const newItem = await prisma.galleryItem.create({ data });
    res.json(newItem);
  } catch (error) { res.status(500).json({ error: 'Failed to create gallery item' }); }
});

app.delete('/api/admin/gallery/:id', async (req, res) => {
  try {
    await prisma.galleryItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete gallery item' }); }
});

// TESTIMONIALS
app.post('/api/admin/testimonials', upload.single('photo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo_url = req.file.url;
    data.display_order = parseInt(data.display_order) || 0;
    if (data.show_description !== undefined) {
      data.show_description = data.show_description === 'true';
    }
    if (data.rating === undefined || data.rating === '' || data.rating === 'null') {
      data.rating = null;
    } else {
      data.rating = parseInt(data.rating);
    }

    if (data.type === 'video') {
      const activeVideos = await prisma.testimonial.count({ where: { type: 'video', is_active: true } });
      if (activeVideos >= 9) {
        return res.status(400).json({ error: 'Maximum 9 video testimonials allowed.' });
      }
      
      if (data.display_order > 0) {
        const existingOrder = await prisma.testimonial.findFirst({
          where: { type: 'video', display_order: data.display_order, is_active: true }
        });
        if (existingOrder) {
          return res.status(400).json({ error: `Display Order ${data.display_order} is already in use.` });
        }
      }
    }
    const newTestimonial = await prisma.testimonial.create({ data });
    res.json(newTestimonial);
  } catch (error) { res.status(500).json({ error: 'Failed to create testimonial' }); }
});

app.put('/api/admin/testimonials/:id', upload.single('photo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo_url = req.file.url;
    if (data.display_order !== undefined) data.display_order = parseInt(data.display_order);
    if (data.show_description !== undefined) {
      data.show_description = data.show_description === 'true';
    }
    if (data.rating === undefined || data.rating === '' || data.rating === 'null') {
      data.rating = null;
    } else {
      data.rating = parseInt(data.rating);
    }

    if (data.type === 'video' || data.display_order > 0) {
      const existingOrder = await prisma.testimonial.findFirst({
        where: { type: 'video', display_order: data.display_order, is_active: true, id: { not: req.params.id } }
      });
      if (existingOrder) {
        return res.status(400).json({ error: `Display Order ${data.display_order} is already in use.` });
      }
    }

    const updated = await prisma.testimonial.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update testimonial' }); }
});

app.delete('/api/admin/testimonials/:id', async (req, res) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete testimonial' }); }
});

// COMMUNITY PARTNERS
app.post('/api/admin/community_partners', upload.single('logo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo_url = req.file.url;
    data.display_order = parseInt(data.display_order) || 0;
    data.is_active = data.is_active === 'true' || data.is_active === true;
    const newPartner = await prisma.communityPartner.create({ data });
    res.json(newPartner);
  } catch (error) { res.status(500).json({ error: 'Failed to create partner' }); }
});

app.put('/api/admin/community_partners/:id', upload.single('logo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo_url = req.file.url;
    if (data.display_order) data.display_order = parseInt(data.display_order);
    if (data.is_active !== undefined) data.is_active = data.is_active === 'true' || data.is_active === true;
    const updated = await prisma.communityPartner.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update partner' }); }
});

app.delete('/api/admin/community_partners/:id', async (req, res) => {
  try {
    await prisma.communityPartner.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete partner' }); }
});

// MENTORS
app.get('/api/admin/mentors', async (req, res) => {
  try {
    const mentors = await prisma.mentor.findMany({ orderBy: { display_order: 'asc' } });
    res.json(mentors);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch mentors' }); }
});

app.put('/api/admin/mentors/reorder', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be an array' });
    const updates = items.map(item => 
      prisma.mentor.update({ where: { id: item.id }, data: { display_order: item.display_order } })
    );
    await prisma.$transaction(updates);
    res.json({ success: true });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder mentors' }); 
  }
});
app.post('/api/admin/mentors', upload.single('photo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.show_linkedin !== undefined) data.show_linkedin = data.show_linkedin === 'true';
    if (req.file) data.photo_url = req.file.url;
    
    // Automatically assign display_order if not provided
    if (!data.display_order) {
      const count = await prisma.mentor.count();
      data.display_order = count + 1;
    } else {
      data.display_order = parseInt(data.display_order);
    }

    const newMentor = await prisma.mentor.create({ data });
    res.json(newMentor);
  } catch (error) { 
    console.error("Error creating mentor:", error);
    res.status(500).json({ error: 'Failed to create mentor' }); 
  }
});

app.put('/api/admin/mentors/:id', upload.single('photo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.show_linkedin !== undefined) data.show_linkedin = data.show_linkedin === 'true';
    if (data.is_active !== undefined) data.is_active = data.is_active === 'true' || data.is_active === true;
    if (req.file) data.photo_url = req.file.url;
    if (data.display_order) data.display_order = parseInt(data.display_order);
    const updated = await prisma.mentor.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { 
    console.error("Mentor Update Error:", error);
    res.status(500).json({ error: 'Failed to update mentor' }); 
  }
});

app.delete('/api/admin/mentors/:id', async (req, res) => {
  try {
    await prisma.mentor.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete mentor' }); }
});


// HERO SLIDES
app.post('/api/admin/hero_slides', upload.single('image'), compressImage, async (req, res) => {
  try {
    const activeSlides = await prisma.heroSlide.count({ where: { is_active: true } });
    if (activeSlides >= 6) {
      return res.status(400).json({ error: 'Maximum limit of 6 hero slides reached. Please delete an existing slide first.' });
    }

    const data = { ...req.body };
    data.display_order = activeSlides + 1;
    if (req.file) data.image_url = req.file.url;
    const newSlide = await prisma.heroSlide.create({ data });
    res.json(newSlide);
  } catch (error) { 
    console.error('Error creating slide:', error);
    res.status(500).json({ error: 'Failed to create slide' }); 
  }
});

app.put('/api/admin/hero_slides/:id', upload.single('image'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.display_order) data.display_order = parseInt(data.display_order, 10);
    if (req.file) data.image_url = req.file.url;
    const updated = await prisma.heroSlide.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { 
    console.error('Error updating slide:', error);
    res.status(500).json({ error: 'Failed to update slide' }); 
  }
});

app.delete('/api/admin/hero_slides/:id', async (req, res) => {
  try {
    await prisma.heroSlide.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete slide' }); }
});

// HOMEPAGE CONTENT
app.put('/api/admin/homepage_content', async (req, res) => {
  try {
    const existing = await prisma.homepageContent.findFirst();
    let updated;
    if (existing) {
      updated = await prisma.homepageContent.update({ where: { id: existing.id }, data: req.body });
    } else {
      updated = await prisma.homepageContent.create({ data: req.body });
    }
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update homepage content' }); }
});

// PROGRAMS
app.post('/api/admin/programs', async (req, res) => {
  try {
    const newProgram = await prisma.program.create({ data: req.body });
    res.json(newProgram);
  } catch (error) { res.status(500).json({ error: 'Failed to create program' }); }
});

app.put('/api/admin/programs/:id', async (req, res) => {
  try {
    const updated = await prisma.program.update({ where: { id: req.params.id }, data: req.body });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update program' }); }
});

app.delete('/api/admin/programs/:id', async (req, res) => {
  try {
    await prisma.program.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete program' }); }
});

// MENTORED STARTUPS
app.get('/api/admin/mentored-startups', async (req, res) => {
  try {
    const startups = await prisma.mentoredStartup.findMany({ orderBy: { display_order: 'asc' }});
    res.json(startups);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch mentored startups' }); }
});

app.post('/api/admin/mentored-startups', upload.single('logo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo_url = req.file.url;
    if (data.display_order !== undefined) data.display_order = parseInt(data.display_order);
    if (data.is_active !== undefined) data.is_active = (data.is_active === 'true' || data.is_active === true);
    
    const newStartup = await prisma.mentoredStartup.create({ data });
    res.json(newStartup);
  } catch (error) { res.status(500).json({ error: 'Failed to create startup' }); }
});

app.put('/api/admin/mentored-startups/:id', upload.single('logo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo_url = req.file.url;
    if (data.display_order !== undefined) data.display_order = parseInt(data.display_order);
    if (data.is_active !== undefined) data.is_active = (data.is_active === 'true' || data.is_active === true);

    const updated = await prisma.mentoredStartup.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update startup' }); }
});

app.delete('/api/admin/mentored-startups/:id', async (req, res) => {
  try {
    await prisma.mentoredStartup.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete startup' }); }
});

// ECOSYSTEM PARTNERS
app.post('/api/admin/community_partners', upload.single('logo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo_url = req.file.url;
    const newPartner = await prisma.communityPartner.create({ data });
    res.json(newPartner);
  } catch (error) { res.status(500).json({ error: 'Failed to create partner' }); }
});

app.put('/api/admin/community_partners/:id', upload.single('logo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.logo_url = req.file.url;
    const updated = await prisma.communityPartner.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update partner' }); }
});

app.delete('/api/admin/community_partners/:id', async (req, res) => {
  try {
    await prisma.communityPartner.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete partner' }); }
});

// LEAD SOURCES
app.get('/api/lead-sources', async (req, res) => {
  try {
    const sources = await prisma.leadSource.findMany({ where: { is_active: true }, orderBy: { created_at: 'asc' } });
    res.json(sources.map(s => ({ id: s.slug, label: s.label })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead sources' });
  }
});

app.post('/api/admin/lead-sources', authMiddleware, async (req, res) => {
  try {
    const { label } = req.body;
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const source = await prisma.leadSource.create({
      data: { label, slug }
    });
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead source' });
  }
});

app.delete('/api/admin/lead-sources/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.leadSource.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead source' });
  }
});

app.get('/api/admin/lead-sources', authMiddleware, async (req, res) => {
  try {
    const sources = await prisma.leadSource.findMany({ orderBy: { created_at: 'asc' } });
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin lead sources' });
  }
});

// LEADS
app.get('/api/admin/leads', async (req, res) => {
  try {
    const { source, status, search } = req.query;
    const whereClause = {};
    if (source) whereClause.source = source;
    if (status) whereClause.status = status;
    if (search) {
      whereClause.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    const leads = await prisma.lead.findMany({ where: whereClause, orderBy: { created_at: 'desc' } });
    res.json(leads);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leads' }); 
  }
});

app.put('/api/admin/leads/:id', async (req, res) => {
  try {
    const updated = await prisma.lead.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update lead status' }); }
});

// REGISTRATIONS
app.get('/api/admin/registrations', authMiddleware, async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({ 
      include: { user: true },
      orderBy: { created_at: 'desc' } 
    });
    res.json(registrations);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch registrations' }); 
  }
});

// SITE SETTINGS
app.put('/api/admin/site_settings', async (req, res) => {
  try {
    const existing = await prisma.siteSetting.findFirst();
    let updated;
    if (existing) {
      updated = await prisma.siteSetting.update({ where: { id: existing.id }, data: req.body });
    } else {
      updated = await prisma.siteSetting.create({ data: req.body });
    }
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update site settings' }); }
});

// PROMO BAR
app.put('/api/admin/promo_bar', authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.promoBar.findFirst({ orderBy: { updated_at: 'desc' } });
    let updated;
    if (existing) {
      updated = await prisma.promoBar.update({ where: { id: existing.id }, data: req.body });
    } else {
      updated = await prisma.promoBar.create({ data: req.body });
    }
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update promo bar' }); }
});

// --- MISSING ADMIN GET ROUTES ---

// Dashboard stats
app.get('/api/admin/dashboard-stats', authMiddleware, async (req, res) => {
  try {
    const [leads, mentors, events, programs, partners, gallery] = await Promise.all([
      prisma.lead.count(),
      prisma.mentor.count({ where: { is_active: true } }),
      prisma.event.count({ where: { is_active: true } }),
      prisma.program.count({ where: { is_active: true } }),
      prisma.communityPartner.count(),
      prisma.galleryItem.count({ where: { is_active: true } }),
    ]);
    const newLeads = await prisma.lead.count({ where: { status: 'new' } });
    res.json({ leads, mentors, events, programs, partners, gallery, newLeads });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch dashboard stats' }); }
});

// Programs list (admin)
app.get('/api/admin/programs', authMiddleware, async (req, res) => {
  try {
    const programs = await prisma.program.findMany({ orderBy: { display_order: 'asc' } });
    res.json(programs);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch programs' }); }
});

// Community partners list (admin)
app.get('/api/admin/community_partners', authMiddleware, async (req, res) => {
  try {
    const partners = await prisma.communityPartner.findMany({ orderBy: { display_order: 'asc' } });
    res.json(partners);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch partners' }); }
});

// Site settings get
app.get('/api/admin/site_settings', authMiddleware, async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findFirst();
    res.json(settings || {});
  } catch (error) { res.status(500).json({ error: 'Failed to fetch site settings' }); }
});

// Hero slides list (admin)
app.get('/api/admin/hero_slides', authMiddleware, async (req, res) => {
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { display_order: 'asc' } });
    res.json(slides);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch hero slides' }); }
});

// ─── BOTTOM VIDEO GALLERY ROUTES ─────────────────────────────────────────────
app.get('/api/admin/bottom_videos', authMiddleware, async (req, res) => {
  try {
    const videos = await prisma.bottomVideoGallery.findMany({ orderBy: { display_order: 'asc' } });
    res.json(videos);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch bottom videos' }); }
});

app.post('/api/admin/bottom_videos', authMiddleware, async (req, res) => {
  try {
    const video = await prisma.bottomVideoGallery.create({ data: req.body });
    res.json(video);
  } catch (error) { res.status(500).json({ error: 'Failed to add bottom video' }); }
});

app.put('/api/admin/bottom_videos/:id', authMiddleware, async (req, res) => {
  try {
    const video = await prisma.bottomVideoGallery.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(video);
  } catch (error) { res.status(500).json({ error: 'Failed to update bottom video' }); }
});

app.delete('/api/admin/bottom_videos/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.bottomVideoGallery.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete bottom video' }); }
});

// ─── OTP ROUTES ──────────────────────────────────────────────────────────────
const { sendMail, sendBulkMail, otpEmailHtml } = require('./utils/mailer');
const { collectPricesFromPageBlocks, pushPricesToLms, pushVisibilityToLms } = require('./utils/priceSync');

// In-memory OTP store: { email -> { otp, name, phone, expiresAt } }
// In production, replace with Redis or a short-lived DB table.
const otpStore = new Map();

app.post('/api/otp/send', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email and phone are required.' });
    }

    // Rate limit: max 3 OTPs per email per 10 minutes
    const existing = otpStore.get(email);
    if (existing && existing.attempts >= 3 && Date.now() < existing.expiresAt) {
      return res.status(429).json({ error: 'Too many OTP requests. Try again in 10 minutes.' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(email, {
      otp,
      name,
      phone,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: (existing?.attempts || 0) + 1,
    });

    // Send OTP email
    await sendMail(email, 'Your OTP – The Startup School', otpEmailHtml(name, otp));

    res.json({ success: true, message: 'OTP sent to ' + email });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Check SMTP configuration.' });
  }
});

app.post('/api/otp/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const stored = otpStore.get(email);
    if (!stored) {
      return res.status(400).json({ error: 'No OTP found for this email. Please request a new one.' });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    if (stored.otp !== String(otp)) {
      return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
    }

    // OTP correct — delete from store and issue a short-lived guest token
    otpStore.delete(email);
    const guestToken = jwt.sign(
      { guest: true, name: stored.name, email, phone: stored.phone },
      process.env.GUEST_TOKEN_SECRET || 'tss_guest_otp_secret_2026',
      { expiresIn: '30m' }
    );

    res.json({
      success: true,
      guestToken,
      user: { name: stored.name, email, phone: stored.phone }
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// ─── ADMIN MAILER ROUTES ──────────────────────────────────────────────────────

// Send bulk email
app.post('/api/admin/mailer/send-bulk', authMiddleware, async (req, res) => {
  try {
    const { subject, message, recipients } = req.body;
    if (!subject || !message || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'subject, message and recipients array are required.' });
    }
    const result = await sendBulkMail(recipients, subject, message, 500);
    res.json(result);
  } catch (error) {
    console.error('Bulk mail error:', error);
    res.status(500).json({ error: 'Failed to send bulk emails.' });
  }
});

// Send single email
app.post('/api/admin/mailer/send-one', authMiddleware, async (req, res) => {
  try {
    const { email, name, subject, message } = req.body;
    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'email, subject and message are required.' });
    }
    const personalizedHtml = message
      .replace(/\{\{name\}\}/g, name || '')
      .replace(/\{\{email\}\}/g, email || '');
    await sendMail(email, subject, personalizedHtml);
    res.json({ success: true });
  } catch (error) {
    console.error('Single mail error:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
});

// ─── LEADS MAILER ROUTES ──────────────────────────────────────────────────────

// Mail all filtered leads (accepts pre-built recipients from client)
app.post('/api/admin/leads/mail-filtered', authMiddleware, async (req, res) => {
  try {
    const { subject, message, recipients } = req.body;
    if (!subject || !message || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'subject, message and recipients array are required.' });
    }
    const result = await sendBulkMail(recipients, subject, message, 500);
    res.json(result);
  } catch (error) {
    console.error('Leads bulk mail error:', error);
    res.status(500).json({ error: 'Failed to send bulk emails.' });
  }
});

// Mail a single lead by ID
app.post('/api/admin/leads/mail-one/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });

    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'subject and message are required.' });
    }
    const personalizedHtml = message
      .replace(/\{\{name\}\}/g, lead.full_name || '')
      .replace(/\{\{email\}\}/g, lead.email || '');
    await sendMail(lead.email, subject, personalizedHtml);
    res.json({ success: true });
  } catch (error) {
    console.error('Lead single mail error:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
});

// ── Global error handler ─────────────────────────────────────────────────────
// MUST be the last app.use() before app.listen(). Catches any error that
// was passed to next(err) or thrown in async handlers without try/catch.
// Returns a generic JSON body — NEVER the raw Node.js stack trace.
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: 'Internal server error.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
