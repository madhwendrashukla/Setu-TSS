const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const { randomUUID } = require('crypto');

// ────────────────────────────────────────────────────────────────────────────
// Defaults & Helpers (Tailored for Setu Startup School Website)
// ────────────────────────────────────────────────────────────────────────────

function defaultActionCards() {
  return [
    {
      id: randomUUID(),
      title: 'WhatsApp community',
      description: 'Join founders across Bharat. Ask questions, collaborate, and get peer feedback.',
      button_text: 'Join community →',
      action_type: 'URL',
      target_url: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
      phone_number: '',
      email_to: '',
      email_subject: '',
      email_body: '',
      icon_class: 'fab fa-whatsapp',
      image_url: '',
      badge: 'Community',
      display_order: 0,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Message us on WhatsApp',
      description: 'Quickest way to reach our admissions and founder support team.',
      button_text: 'Chat on WhatsApp →',
      action_type: 'URL',
      target_url: 'https://wa.me/919289121121',
      phone_number: '',
      email_to: '',
      email_subject: '',
      email_body: '',
      icon_class: 'fab fa-whatsapp',
      image_url: '',
      badge: 'Direct Connect',
      display_order: 1,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Call Founder Support',
      description: 'Speak directly with our team regarding cohort details, admissions, or assistance.',
      button_text: 'Call +91 92891 21121 →',
      action_type: 'PHONE',
      target_url: '',
      phone_number: '+91 92891 21121',
      email_to: '',
      email_subject: '',
      email_body: '',
      icon_class: 'fas fa-phone-alt',
      image_url: '',
      badge: 'Direct Call',
      display_order: 2,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Program & Cohort Inquiry',
      description: 'Send us an email regarding Cohort 2026, Startup Launchpad, or masterclasses.',
      button_text: 'Send email →',
      action_type: 'EMAIL',
      target_url: '',
      phone_number: '',
      email_to: 'info@setustartupschool.com',
      email_subject: 'Inquiry regarding Setu Startup School Cohort 2026',
      email_body: 'Hi Setu Startup School Team,\n\nI am interested in learning more about the upcoming cohort and founder programs.\n\nMy Details:\n- Name:\n- Startup / Idea:\n\nThank you!',
      icon_class: 'fas fa-envelope',
      image_url: '',
      badge: 'Admissions',
      display_order: 3,
      is_active: true,
    },
  ];
}

function defaultInfoBoxItems() {
  return [
    {
      id: randomUUID(),
      text: 'Guidance on choosing the right cohort, incubation program, or masterclass for your startup stage.',
      display_order: 0,
      is_active: true,
    },
    {
      id: randomUUID(),
      text: '1-on-1 mentorship, pitch deck reviews, and fundraising support.',
      display_order: 1,
      is_active: true,
    },
    {
      id: randomUUID(),
      text: 'Joining the founder WhatsApp community and attending offline mixer sessions.',
      display_order: 2,
      is_active: true,
    },
    {
      id: randomUUID(),
      text: 'Queries regarding admissions, session schedules, invoices, or founder certificates.',
      display_order: 3,
      is_active: true,
    },
    {
      id: randomUUID(),
      text: 'Ecosystem partnerships, college E-Cell collaborations, and angel investor network connects.',
      display_order: 4,
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
        title: 'Connect with <span style="color: #7C3AED;">Setu Startup School</span>',
        description: '<p>Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.</p>',
        back_btn_text: '← Back',
        back_btn_link: '/',
        action_cards: defaultActionCards(),
        show_problem_banner: false,
        show_info_box: true,
        info_box_title: 'How we can help you',
        info_box_icon: 'fas fa-question-circle',
        info_box_items: defaultInfoBoxItems(),
        social_links: [],
        faqs: [],
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

    // Action cards
    let actionCards = Array.isArray(content.action_cards) && content.action_cards.length > 0 
      ? content.action_cards 
      : defaultActionCards();
    actionCards = actionCards
      .filter(c => c && c.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    // Info box items
    let infoBoxItems = Array.isArray(content.info_box_items) && content.info_box_items.length > 0
      ? content.info_box_items
      : defaultInfoBoxItems();
    infoBoxItems = infoBoxItems
      .filter(i => i && i.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    res.json({
      ...content,
      title: content.title || 'Connect with <span style="color: #7C3AED;">Setu Startup School</span>',
      description: content.description || '<p>Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.</p>',
      back_btn_text: content.back_btn_text || '← Back',
      back_btn_link: content.back_btn_link || '/',
      action_cards: actionCards,
      show_problem_banner: false,
      show_info_box: content.show_info_box !== false,
      info_box_title: content.info_box_title || 'How we can help you',
      info_box_icon: content.info_box_icon || 'fas fa-question-circle',
      info_box_items: infoBoxItems,
    });
  } catch (error) {
    console.error('Failed to fetch public contact content:', error);
    res.json({
      badge_text: "Get in Touch • We're Here For You",
      title: 'Connect with <span style="color: #7C3AED;">Setu Startup School</span>',
      description: '<p>Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.</p>',
      back_btn_text: '← Back',
      back_btn_link: '/',
      action_cards: defaultActionCards(),
      show_problem_banner: false,
      show_info_box: true,
      info_box_title: 'How we can help you',
      info_box_icon: 'fas fa-question-circle',
      info_box_items: defaultInfoBoxItems(),
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
      show_founder_card: false,
      show_faqs: false,
      social_links: [],
      faqs: [],
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
    res.json({
      ...content,
      action_cards: Array.isArray(content.action_cards) && content.action_cards.length > 0 ? content.action_cards : defaultActionCards(),
      info_box_items: Array.isArray(content.info_box_items) && content.info_box_items.length > 0 ? content.info_box_items : defaultInfoBoxItems(),
    });
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
        
        back_btn_text: data.back_btn_text !== undefined ? String(data.back_btn_text) : (current.back_btn_text || '← Back'),
        back_btn_link: data.back_btn_link !== undefined ? String(data.back_btn_link) : (current.back_btn_link || '/'),

        action_cards: Array.isArray(data.action_cards) ? data.action_cards : (current.action_cards || defaultActionCards()),

        show_problem_banner: false,

        show_info_box: data.show_info_box !== undefined ? Boolean(data.show_info_box) : current.show_info_box,
        info_box_title: data.info_box_title !== undefined ? String(data.info_box_title) : current.info_box_title,
        info_box_icon: data.info_box_icon !== undefined ? String(data.info_box_icon) : current.info_box_icon,
        info_box_items: Array.isArray(data.info_box_items) ? data.info_box_items : (current.info_box_items || defaultInfoBoxItems()),

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
        show_founder_card: false,
        show_faqs: false,
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
