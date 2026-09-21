const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const { randomUUID } = require('crypto');

// ────────────────────────────────────────────────────────────────────────────
// Defaults & Helpers
// ────────────────────────────────────────────────────────────────────────────

function defaultSocialLinks() {
  return [
    {
      id: randomUUID(),
      name: 'LinkedIn',
      handle: 'Setu - TheStartupSchool',
      url: 'https://www.linkedin.com/company/the-startup-school-2026/',
      icon: 'fab fa-linkedin-in',
      color: 'text-[#0A66C2] bg-blue-50 border-blue-100 hover:bg-[#0A66C2] hover:text-white',
      badge: 'Professional Network',
      display_order: 0,
      is_active: true,
    },
    {
      id: randomUUID(),
      name: 'Instagram',
      handle: '@the__startup__school',
      url: 'https://www.instagram.com/the__startup__school',
      icon: 'fab fa-instagram',
      color: 'text-[#E1306C] bg-pink-50 border-pink-100 hover:bg-[#E1306C] hover:text-white',
      badge: 'Behind the Scenes',
      display_order: 1,
      is_active: true,
    },
    {
      id: randomUUID(),
      name: 'YouTube',
      handle: '@setustartupschool',
      url: 'https://youtube.com/@setustartupschool?si=UPdcAl5qcCH9gzow',
      icon: 'fab fa-youtube',
      color: 'text-[#FF0000] bg-red-50 border-red-100 hover:bg-[#FF0000] hover:text-white',
      badge: 'Masterclasses & Hacks',
      display_order: 2,
      is_active: true,
    },
    {
      id: randomUUID(),
      name: 'WhatsApp Community',
      handle: 'Join Founder Group',
      url: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
      icon: 'fab fa-whatsapp',
      color: 'text-[#25D366] bg-emerald-50 border-emerald-100 hover:bg-[#25D366] hover:text-white',
      badge: 'Direct Founder Group',
      display_order: 3,
      is_active: true,
    },
    {
      id: randomUUID(),
      name: 'Twitter / X',
      handle: '@The_startup_sch',
      url: 'https://x.com/The_startup_sch',
      icon: 'fab fa-x-twitter',
      color: 'text-slate-900 bg-slate-100 border-slate-200 hover:bg-black hover:text-white',
      badge: 'Updates & Insights',
      display_order: 4,
      is_active: true,
    },
  ];
}

function defaultFaqs() {
  return [
    {
      id: randomUUID(),
      q: 'Who is Setu Startup School for?',
      a: 'Setu is built for aspiring founders, early-stage builders, college students with startup ideas, and working professionals looking to transition into entrepreneurship. We bridge the 4 deadly gaps of Learning, Access, Mentoring, and Community.',
      display_order: 0,
      is_active: true,
    },
    {
      id: randomUUID(),
      q: 'What happens after I submit this inquiry form?',
      a: 'Our admissions & founder relations team reviews your note and contacts you via WhatsApp or Email within 24 hours to guide you on the right program, cohort, or next steps.',
      display_order: 1,
      is_active: true,
    },
    {
      id: randomUUID(),
      q: 'Are your programs and workshops online or in-person?',
      a: 'We offer interactive live online cohort sessions accessible across Bharat and globally, as well as exclusive in-person mixer sessions and workshops in major hub cities like Mumbai, Bengaluru, and Delhi NCR.',
      display_order: 2,
      is_active: true,
    },
    {
      id: randomUUID(),
      q: 'Can I connect directly with mentor Gaurav Bansal?',
      a: 'Yes! You can visit his dedicated profile at foundersschool.in/gauravbansal to save his contact card, explore his masterclasses, or connect directly on LinkedIn.',
      display_order: 3,
      is_active: true,
    },
  ];
}

/** Always work with the single contact page content row, creating with defaults if absent */
async function getOrCreateContactContent() {
  let content = await prisma.contactPageContent.findFirst();
  if (!content) {
    content = await prisma.contactPageContent.create({
      data: {
        social_links: defaultSocialLinks(),
        faqs: defaultFaqs(),
      },
    });
  }
  return content;
}

// ────────────────────────────────────────────────────────────────────────────
// Public Router (no auth required — consumed by /contact page)
// ────────────────────────────────────────────────────────────────────────────
const publicRouter = express.Router();

publicRouter.get('/', async (_req, res) => {
  try {
    const content = await getOrCreateContactContent();

    // Filter active social links and sort by display_order
    let socialLinks = Array.isArray(content.social_links) ? content.social_links : [];
    socialLinks = socialLinks
      .filter(l => l && l.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    // Filter active FAQs and sort by display_order
    let faqs = Array.isArray(content.faqs) ? content.faqs : [];
    faqs = faqs
      .filter(f => f && f.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    res.json({
      ...content,
      social_links: socialLinks,
      faqs: faqs,
    });
  } catch (error) {
    console.error('Failed to fetch public contact content:', error);
    // Fallback response with defaults if database is temporarily unavailable
    res.json({
      badge_text: "Get in Touch • We're Here For You",
      title: 'Connect with <span class="text-[#A855F7]">Setu Startup School</span>',
      description: 'Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.',
      form_heading: 'Send Us a Message',
      form_subheading: 'Fill in the form below and our team will get back to you within 24 hours.',
      lead_source_tag: 'contact_page',
      submit_btn_text: 'Submit Inquiry',
      success_heading: 'Message Sent Successfully!',
      success_message: 'Thank you for reaching out! A member of the Setu Startup School team will connect with you shortly.',
      email: 'info@setustartupschool.com',
      phone: '+91 92891 21121',
      address: '98-103, Aditya Industrial Estate, behind Evershine Mall, Chincholi Bunder, Malad West, Mumbai, Maharashtra 400064',
      chat_link: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
      show_founder_card: true,
      founder_name: 'Gaurav Bansal',
      founder_title: 'Founder & Chief Mentor • Setu Startup School',
      founder_tag: 'Founder Profile',
      founder_photo_url: '/gaurav.webp',
      founder_link: '/gauravbansal',
      show_faqs: true,
      social_links: defaultSocialLinks(),
      faqs: defaultFaqs(),
    });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Admin Router (protected by authMiddleware)
// ────────────────────────────────────────────────────────────────────────────
const adminRouter = express.Router();

adminRouter.get('/', authMiddleware, async (_req, res) => {
  try {
    const content = await getOrCreateContactContent();
    res.json(content);
  } catch (error) {
    console.error('Failed to fetch admin contact page content:', error);
    res.status(500).json({ error: 'Failed to fetch contact page settings' });
  }
});

adminRouter.put('/', authMiddleware, async (req, res) => {
  try {
    const current = await getOrCreateContactContent();
    const data = req.body || {};

    const updated = await prisma.contactPageContent.update({
      where: { id: current.id },
      data: {
        badge_text: data.badge_text !== undefined ? String(data.badge_text) : current.badge_text,
        title: data.title !== undefined ? String(data.title) : current.title,
        description: data.description !== undefined ? String(data.description) : current.description,
        
        form_heading: data.form_heading !== undefined ? String(data.form_heading) : current.form_heading,
        form_subheading: data.form_subheading !== undefined ? String(data.form_subheading) : current.form_subheading,
        lead_source_tag: data.lead_source_tag !== undefined ? String(data.lead_source_tag) : current.lead_source_tag,
        submit_btn_text: data.submit_btn_text !== undefined ? String(data.submit_btn_text) : current.submit_btn_text,
        success_heading: data.success_heading !== undefined ? String(data.success_heading) : current.success_heading,
        success_message: data.success_message !== undefined ? String(data.success_message) : current.success_message,

        email: data.email !== undefined ? String(data.email) : current.email,
        phone: data.phone !== undefined ? String(data.phone) : current.phone,
        address: data.address !== undefined ? String(data.address) : current.address,
        chat_link: data.chat_link !== undefined ? String(data.chat_link) : current.chat_link,

        social_links: Array.isArray(data.social_links) ? data.social_links : current.social_links,

        show_founder_card: data.show_founder_card !== undefined ? Boolean(data.show_founder_card) : current.show_founder_card,
        founder_name: data.founder_name !== undefined ? String(data.founder_name) : current.founder_name,
        founder_title: data.founder_title !== undefined ? String(data.founder_title) : current.founder_title,
        founder_tag: data.founder_tag !== undefined ? String(data.founder_tag) : current.founder_tag,
        founder_photo_url: data.founder_photo_url !== undefined ? String(data.founder_photo_url) : current.founder_photo_url,
        founder_link: data.founder_link !== undefined ? String(data.founder_link) : current.founder_link,

        show_faqs: data.show_faqs !== undefined ? Boolean(data.show_faqs) : current.show_faqs,
        faqs: Array.isArray(data.faqs) ? data.faqs : current.faqs,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Failed to update contact page content:', error);
    res.status(500).json({ error: 'Failed to update contact page settings' });
  }
});

module.exports = {
  publicRouter,
  adminRouter,
};
