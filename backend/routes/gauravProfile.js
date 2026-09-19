const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const { randomUUID } = require('crypto');

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/** Always work with the single profile row, creating it with defaults if absent. */
async function getOrCreateProfile() {
  let profile = await prisma.gauravProfile.findFirst();
  if (!profile) {
    profile = await prisma.gauravProfile.create({
      data: {
        ecosystem_links: defaultEcosystemLinks(),
        founder_links: defaultFounderLinks(),
      },
    });
  }
  return profile;
}

function defaultEcosystemLinks() {
  return [
    {
      id: uuidv4(),
      label: 'Visit Website',
      sublabel: 'setustartupschool.com',
      url: 'https://setustartupschool.com',
      icon: 'fas fa-globe',
      style: 'primary',
      color: 'violet',
      display_order: 0,
      is_active: true,
    },
    {
      id: uuidv4(),
      label: 'Setu - TheStartupSchool LinkedIn',
      sublabel: '',
      url: 'https://www.linkedin.com/company/the-startup-school-2026/',
      icon: 'fab fa-linkedin',
      style: 'glass',
      color: 'blue',
      display_order: 1,
      is_active: true,
    },
    {
      id: uuidv4(),
      label: 'Follow our Instagram',
      sublabel: '',
      url: 'https://www.instagram.com/the__startup__school',
      icon: 'fab fa-instagram',
      style: 'glass',
      color: 'pink',
      display_order: 2,
      is_active: true,
    },
  ];
}

function defaultFounderLinks() {
  return [
    {
      id: uuidv4(),
      label: 'Connect with Gaurav',
      sublabel: '',
      url: 'https://www.linkedin.com/in/gauravbansal2/',
      icon: 'fab fa-linkedin-in',
      style: 'glass',
      color: 'white',
      display_order: 0,
      is_active: true,
    },
    {
      id: uuidv4(),
      label: "Founder's Hacks",
      sublabel: 'Masterclass Video',
      url: 'https://www.youtube.com/watch?v=tt_PVE_A3wU',
      icon: 'fab fa-youtube',
      style: 'glass',
      color: 'red',
      display_order: 1,
      is_active: true,
    },
  ];
}

// ────────────────────────────────────────────────────────────────────────────
// Public Router  (no auth required — consumed by the Next.js page)
// ────────────────────────────────────────────────────────────────────────────
const publicRouter = express.Router();

publicRouter.get('/', async (_req, res) => {
  try {
    const profile = await getOrCreateProfile();
    // Filter out inactive links before sending to public
    const pub = {
      ...profile,
      ecosystem_links: (profile.ecosystem_links || []).filter((l) => l.is_active),
      founder_links: (profile.founder_links || []).filter((l) => l.is_active),
    };
    res.json(pub);
  } catch (err) {
    console.error('gauravProfile public GET error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Admin Router  (auth required)
// ────────────────────────────────────────────────────────────────────────────
const adminRouter = express.Router();
adminRouter.use(authMiddleware);

/** GET full profile (all links, including inactive) */
adminRouter.get('/', async (_req, res) => {
  try {
    const profile = await getOrCreateProfile();
    res.json(profile);
  } catch (err) {
    console.error('gauravProfile admin GET error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT — update scalar fields (name, tagline, photo_url, org, title, phone,
 * email, website, address, vcard_filename, footer_brand_name, footer_tagline).
 * Does NOT touch link arrays.
 */
adminRouter.put('/', async (req, res) => {
  try {
    const profile = await getOrCreateProfile();
    const ALLOWED = [
      'name', 'tagline', 'photo_url',
      'org', 'title', 'phone', 'email', 'website', 'address', 'vcard_filename',
      'footer_brand_name', 'footer_tagline',
    ];
    const data = {};
    for (const key of ALLOWED) {
      if (key in req.body) data[key] = req.body[key];
    }
    const updated = await prisma.gauravProfile.update({
      where: { id: profile.id },
      data,
    });
    res.json(updated);
  } catch (err) {
    console.error('gauravProfile admin PUT error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ── Link helpers ─────────────────────────────────────────────────────────────

/** Validate section name */
function parseSection(section) {
  if (section === 'ecosystem') return 'ecosystem_links';
  if (section === 'founder') return 'founder_links';
  return null;
}

/**
 * PUT /links/:section — replace the entire link array for a section.
 * Body: { links: [...] }
 */
adminRouter.put('/links/:section', async (req, res) => {
  try {
    const field = parseSection(req.params.section);
    if (!field) return res.status(400).json({ error: 'Invalid section. Use ecosystem or founder.' });

    const { links } = req.body;
    if (!Array.isArray(links)) return res.status(400).json({ error: 'links must be an array' });

    const profile = await getOrCreateProfile();
    const updated = await prisma.gauravProfile.update({
      where: { id: profile.id },
      data: { [field]: links },
    });
    res.json(updated);
  } catch (err) {
    console.error('gauravProfile links PUT error:', err);
    res.status(500).json({ error: 'Failed to update links' });
  }
});

/**
 * POST /links/:section — add a new link to a section.
 * Body: link object (without id — we generate one).
 */
adminRouter.post('/links/:section', async (req, res) => {
  try {
    const field = parseSection(req.params.section);
    if (!field) return res.status(400).json({ error: 'Invalid section' });

    const profile = await getOrCreateProfile();
    const existingLinks = Array.isArray(profile[field]) ? profile[field] : [];
    const newLink = { id: randomUUID(), display_order: existingLinks.length, is_active: true, ...req.body };
    const updated = await prisma.gauravProfile.update({
      where: { id: profile.id },
      data: { [field]: [...existingLinks, newLink] },
    });
    res.json(updated);
  } catch (err) {
    console.error('gauravProfile links POST error:', err);
    res.status(500).json({ error: 'Failed to add link' });
  }
});

/**
 * PUT /links/:section/:linkId — update a single link.
 */
adminRouter.put('/links/:section/:linkId', async (req, res) => {
  try {
    const field = parseSection(req.params.section);
    if (!field) return res.status(400).json({ error: 'Invalid section' });

    const profile = await getOrCreateProfile();
    const links = Array.isArray(profile[field]) ? profile[field] : [];
    const idx = links.findIndex((l) => l.id === req.params.linkId);
    if (idx === -1) return res.status(404).json({ error: 'Link not found' });

    links[idx] = { ...links[idx], ...req.body, id: req.params.linkId };
    const updated = await prisma.gauravProfile.update({
      where: { id: profile.id },
      data: { [field]: links },
    });
    res.json(updated);
  } catch (err) {
    console.error('gauravProfile link PUT error:', err);
    res.status(500).json({ error: 'Failed to update link' });
  }
});

/**
 * DELETE /links/:section/:linkId — remove a single link.
 */
adminRouter.delete('/links/:section/:linkId', async (req, res) => {
  try {
    const field = parseSection(req.params.section);
    if (!field) return res.status(400).json({ error: 'Invalid section' });

    const profile = await getOrCreateProfile();
    const links = Array.isArray(profile[field]) ? profile[field] : [];
    const filtered = links.filter((l) => l.id !== req.params.linkId);
    const updated = await prisma.gauravProfile.update({
      where: { id: profile.id },
      data: { [field]: filtered },
    });
    res.json(updated);
  } catch (err) {
    console.error('gauravProfile link DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

module.exports = { publicRouter, adminRouter };
