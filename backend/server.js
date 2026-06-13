const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const { upload, compressImage } = require('./utils/upload');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- AUTH API ---
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  // Simplified auth for demo; in production use bcrypt
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret');
  res.json({ token });
});

// --- PUBLIC API ENDPOINTS ---
app.get('/api/events/pinned', async (req, res) => {
  try {
    const pinnedEvent = await prisma.event.findFirst({ where: { is_pinned: true, is_past: false, is_active: true } });
    res.json(pinnedEvent);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch pinned event' }); }
});

app.get('/api/events/past-rolling', async (req, res) => {
  try {
    const pastEvents = await prisma.event.findMany({ where: { is_past: true, is_active: true }, orderBy: { start_date: 'desc' } });
    res.json(pastEvents);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch past events' }); }
});

app.get('/api/events', async (req, res) => {
  try {
    const { upcoming, past } = req.query;
    let whereClause = { is_active: true };
    if (upcoming === 'true') whereClause.is_past = false;
    if (past === 'true') whereClause.is_past = true;
    const events = await prisma.event.findMany({ where: whereClause, orderBy: { start_date: 'asc' } });
    res.json(events);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch events' }); }
});

app.get('/api/events/:slug', async (req, res) => {
  try {
    const event = await prisma.event.findFirst({ where: { slug: req.params.slug, is_active: true } });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch event details' }); }
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

app.get('/api/homepage', async (req, res) => {
  try {
    const [heroSlides, homepageContent, programs, galleryItems, testimonials, partners, siteSettings] = await Promise.all([
      prisma.heroSlide.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.homepageContent.findFirst(),
      prisma.program.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.galleryItem.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.testimonial.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.communityPartner.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.siteSetting.findFirst()
    ]);
    res.json({ heroSlides, homepageContent, programs, galleryItems, testimonials, partners, siteSettings });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch homepage data' }); }
});

// --- ADMIN API ENDPOINTS (Protected) ---
app.use('/api/admin', authMiddleware);

// EVENTS
app.post('/api/admin/events', upload.single('banner'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.banner_url = req.file.url;
    // Handle pinning logic
    if (data.is_pinned === 'true' || data.is_pinned === true) {
      await prisma.event.updateMany({ data: { is_pinned: false } }); // Unpin others
      data.is_pinned = true;
    }
    const newEvent = await prisma.event.create({ data });
    res.json(newEvent);
  } catch (error) { res.status(500).json({ error: 'Failed to create event' }); }
});

app.put('/api/admin/events/:id', upload.single('banner'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.banner_url = req.file.url;
    if (data.is_pinned === 'true' || data.is_pinned === true) {
      await prisma.event.updateMany({ data: { is_pinned: false } }); // Unpin others
      data.is_pinned = true;
    }
    const updated = await prisma.event.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update event' }); }
});

app.delete('/api/admin/events/:id', async (req, res) => {
  try {
    await prisma.event.update({ where: { id: req.params.id }, data: { is_active: false } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete event' }); }
});

// GALLERY
app.post('/api/admin/gallery', upload.single('media'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.media_url = req.file.url;

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

// TESTIMONIALS
app.post('/api/admin/testimonials', upload.single('photo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo_url = req.file.url;

    if (data.type === 'video') {
      const activeVideos = await prisma.testimonial.count({ where: { type: 'video', is_active: true } });
      if (activeVideos >= 4) {
        return res.status(400).json({ error: 'Maximum 4 video testimonials allowed.' });
      }
    }
    const newTestimonial = await prisma.testimonial.create({ data });
    res.json(newTestimonial);
  } catch (error) { res.status(500).json({ error: 'Failed to create testimonial' }); }
});

// MENTORS
app.post('/api/admin/mentors', upload.single('photo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo_url = req.file.url;
    const newMentor = await prisma.mentor.create({ data });
    res.json(newMentor);
  } catch (error) { res.status(500).json({ error: 'Failed to create mentor' }); }
});


// HERO SLIDES
app.post('/api/admin/hero_slides', upload.single('image'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image_url = req.file.url;
    const newSlide = await prisma.heroSlide.create({ data });
    res.json(newSlide);
  } catch (error) { res.status(500).json({ error: 'Failed to create slide' }); }
});

app.put('/api/admin/hero_slides/:id', upload.single('image'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image_url = req.file.url;
    const updated = await prisma.heroSlide.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update slide' }); }
});

app.delete('/api/admin/hero_slides/:id', async (req, res) => {
  try {
    await prisma.heroSlide.update({ where: { id: req.params.id }, data: { is_active: false } });
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
    await prisma.program.update({ where: { id: req.params.id }, data: { is_active: false } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete program' }); }
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
    await prisma.communityPartner.update({ where: { id: req.params.id }, data: { is_active: false } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Failed to delete partner' }); }
});

// LEADS
app.get('/api/admin/leads', async (req, res) => {
  try {
    const { source } = req.query;
    const whereClause = source ? { source } : {};
    const leads = await prisma.lead.findMany({ where: whereClause, orderBy: { created_at: 'desc' } });
    res.json(leads);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch leads' }); }
});

app.put('/api/admin/leads/:id', async (req, res) => {
  try {
    const updated = await prisma.lead.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update lead status' }); }
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
