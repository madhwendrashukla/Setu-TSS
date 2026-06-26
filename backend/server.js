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
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
// Serve uploaded images statically (Removed - now using AWS S3)
// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- AUTH API ---
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const isValid = user && await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

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
  } catch (error) { res.status(500).json({ error: 'Failed to fetch event' }); }
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
    const testimonials = await prisma.testimonial.findMany({ 
      where: { is_active: true }, 
      orderBy: { display_order: 'asc' } 
    });
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

app.get('/api/homepage', async (req, res) => {
  try {
    const [heroSlides, homepageContent, programs, galleryItems, testimonials, partners, siteSettings, mentors, mentoredStartups] = await Promise.all([
      prisma.heroSlide.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.homepageContent.findFirst(),
      prisma.program.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.galleryItem.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.testimonial.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.communityPartner.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.siteSetting.findFirst(),
      prisma.mentor.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }}),
      prisma.mentoredStartup.findMany({ where: { is_active: true }, orderBy: { display_order: 'asc' }})
    ]);
    res.json({ heroSlides, homepageContent, programs, galleryItems, testimonials, partners, siteSettings, mentors, mentoredStartups });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch homepage data' }); }
});

// --- ADMIN API ENDPOINTS (Protected) ---
app.use('/api/admin', authMiddleware);

// EVENTS
app.post('/api/admin/events', upload.single('banner'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.banner_url = req.file.url;
    
    data.is_pinned = (data.is_pinned === 'true' || data.is_pinned === true);
    if (data.is_pinned) {
      await prisma.event.updateMany({ data: { is_pinned: false } });
    }
    
    if (data.is_past !== undefined) {
      data.is_past = (data.is_past === 'true' || data.is_past === true);
    }
    
    if (data.start_date) data.start_date = new Date(data.start_date);
    if (data.end_date) data.end_date = new Date(data.end_date);

    const newEvent = await prisma.event.create({ data });
    res.json(newEvent);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' }); 
  }
});

app.put('/api/admin/events/:id', upload.single('banner'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.banner_url = req.file.url;
    
    if (data.is_pinned !== undefined) {
      data.is_pinned = (data.is_pinned === 'true' || data.is_pinned === true);
      if (data.is_pinned) {
        await prisma.event.updateMany({ data: { is_pinned: false } });
      }
    }
    
    if (data.is_past !== undefined) {
      data.is_past = (data.is_past === 'true' || data.is_past === true);
    }
    
    if (data.start_date) data.start_date = new Date(data.start_date);
    if (data.end_date) data.end_date = new Date(data.end_date);

    const updated = await prisma.event.update({ where: { id: req.params.id }, data });
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

app.put('/api/admin/testimonials/:id', upload.single('photo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo_url = req.file.url;
    if (data.display_order) data.display_order = parseInt(data.display_order);
    if (data.show_description !== undefined) {
      data.show_description = data.show_description === 'true';
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
app.post('/api/admin/mentors', upload.single('photo'), compressImage, async (req, res) => {
  try {
    const data = { ...req.body };
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
    if (req.file) data.photo_url = req.file.url;
    if (data.display_order) data.display_order = parseInt(data.display_order);
    const updated = await prisma.mentor.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (error) { res.status(500).json({ error: 'Failed to update mentor' }); }
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
    if (activeSlides >= 5) {
      return res.status(400).json({ error: 'Maximum limit of 5 hero slides reached. Please delete an existing slide first.' });
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
