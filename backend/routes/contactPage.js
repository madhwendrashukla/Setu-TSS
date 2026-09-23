const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const { randomUUID } = require('crypto');

// ────────────────────────────────────────────────────────────────────────────
// Defaults & Helpers (Tailored for Setu Startup School Website)
// ────────────────────────────────────────────────────────────────────────────

function cleanHtmlText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/&nbsp;/g, ' ')  // replace non-breaking spaces
    .replace(/\s+/g, ' ')     // collapse extra spaces
    .trim();
}

function defaultActionCards() {
  return [
    {
      id: randomUUID(),
      title: 'WhatsApp community',
      description: 'Join founders across Bharat. Ask questions, collaborate, and get peer feedback.',
      button_text: 'Join community →',
      button_url: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
      action_type: 'whatsapp',
      icon: 'users',
      badge: 'Community',
      display_order: 0,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Message us on WhatsApp',
      description: 'Quickest way to reach our admissions and founder support team.',
      button_text: 'Chat on WhatsApp →',
      button_url: 'https://wa.me/919289121121',
      action_type: 'whatsapp',
      icon: 'message',
      badge: 'Direct Connect',
      display_order: 1,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Book a 1-on-1 Mentor Call',
      description: 'Talk to mentor Gaurav Bansal about your startup idea, pitch deck, or traction.',
      button_text: 'Book a slot →',
      button_url: 'https://foundersschool.in/gauravbansal',
      action_type: 'url',
      icon: 'calendar',
      badge: 'Mentorship',
      display_order: 2,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Program & Cohort Inquiry',
      description: 'Have questions regarding Cohort 2026, Startup Launchpad, or masterclasses?',
      button_text: 'Send inquiry →',
      button_url: '',
      action_type: 'inquiry_modal',
      icon: 'mail',
      badge: 'Admissions',
      display_order: 3,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Partnerships & E-Cells',
      description: 'Partner as an incubator, investor network, college E-Cell, or corporate sponsor.',
      button_text: 'Partner with us →',
      button_url: '',
      action_type: 'inquiry_modal',
      icon: 'sparkles',
      badge: 'Partnership',
      display_order: 4,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Give feedback & Ideas',
      description: 'Tell us what startup topics, tools, or founder workshops you want to see next.',
      button_text: 'Share feedback →',
      button_url: '',
      action_type: 'feedback_modal',
      icon: 'feedback',
      badge: 'Your Voice',
      display_order: 5,
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
        title: 'Support & <span class="text-[#7C3AED]">Contact</span>',
        description: 'Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Reach out across our channels below or connect with our team.',
        back_btn_text: '← Back',
        back_btn_link: '/',
        action_cards: defaultActionCards(),
        show_problem_banner: false,
        problem_banner_title: 'Need Custom Mentorship for your Startup?',
        problem_banner_desc: 'Looking for tailored 1-on-1 guidance or institutional partnership? Let us know your goals.',
        problem_banner_action_text: 'Explore Programs',
        problem_banner_action_url: '/events',
        problem_banner_icon: 'fas fa-rocket',
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

    const cleanDescription = cleanHtmlText(content.description) || 
      'Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Reach out across our channels below or connect with our team.';

    res.json({
      ...content,
      title: content.title || 'Support & <span class="text-[#7C3AED]">Contact</span>',
      description: cleanDescription,
      back_btn_text: content.back_btn_text || '← Back',
      back_btn_link: content.back_btn_link || '/',
      action_cards: actionCards,
      show_problem_banner: content.show_problem_banner === true,
      problem_banner_title: content.problem_banner_title || 'Need Custom Mentorship for your Startup?',
      problem_banner_desc: content.problem_banner_desc || 'Looking for tailored 1-on-1 guidance or institutional partnership? Let us know your goals.',
      problem_banner_action_text: content.problem_banner_action_text || 'Explore Programs',
      problem_banner_action_url: content.problem_banner_action_url || '/events',
      problem_banner_icon: content.problem_banner_icon || 'fas fa-rocket',
      show_info_box: content.show_info_box !== false,
      info_box_title: content.info_box_title || 'How we can help you',
      info_box_icon: content.info_box_icon || 'fas fa-question-circle',
      info_box_items: infoBoxItems,
    });
  } catch (error) {
    console.error('Failed to fetch public contact content:', error);
    // Fallback response with website-tailored defaults
    res.json({
      badge_text: "Get in Touch • We're Here For You",
      title: 'Support & <span class="text-[#7C3AED]">Contact</span>',
      description: 'Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Reach out across our channels below or connect with our team.',
      back_btn_text: '← Back',
      back_btn_link: '/',
      action_cards: defaultActionCards(),
      show_problem_banner: false,
      problem_banner_title: 'Need Custom Mentorship for your Startup?',
      problem_banner_desc: 'Looking for tailored 1-on-1 guidance or institutional partnership? Let us know your goals.',
      problem_banner_action_text: 'Explore Programs',
      problem_banner_action_url: '/events',
      problem_banner_icon: 'fas fa-rocket',
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
    const cleanDescription = cleanHtmlText(content.description) || 
      'Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Reach out across our channels below or connect with our team.';

    res.json({
      ...content,
      description: cleanDescription,
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

    const cleanDescription = data.description !== undefined ? cleanHtmlText(data.description) : current.description;

    const updated = await prisma.contactPageContent.update({
      where: { id: current.id },
      data: {
        badge_text: data.badge_text !== undefined ? String(data.badge_text) : current.badge_text,
        title: data.title !== undefined ? String(data.title) : current.title,
        description: cleanDescription,
        
        back_btn_text: data.back_btn_text !== undefined ? String(data.back_btn_text) : (current.back_btn_text || '← Back'),
        back_btn_link: data.back_btn_link !== undefined ? String(data.back_btn_link) : (current.back_btn_link || '/'),

        action_cards: Array.isArray(data.action_cards) ? data.action_cards : (current.action_cards || defaultActionCards()),

        show_problem_banner: data.show_problem_banner !== undefined ? Boolean(data.show_problem_banner) : current.show_problem_banner,
        problem_banner_title: data.problem_banner_title !== undefined ? String(data.problem_banner_title) : current.problem_banner_title,
        problem_banner_desc: data.problem_banner_desc !== undefined ? String(data.problem_banner_desc) : current.problem_banner_desc,
        problem_banner_action_text: data.problem_banner_action_text !== undefined ? String(data.problem_banner_action_text) : current.problem_banner_action_text,
        problem_banner_action_url: data.problem_banner_action_url !== undefined ? String(data.problem_banner_action_url) : current.problem_banner_action_url,
        problem_banner_icon: data.problem_banner_icon !== undefined ? String(data.problem_banner_icon) : current.problem_banner_icon,

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

        show_founder_card: data.show_founder_card !== undefined ? Boolean(data.show_founder_card) : current.show_founder_card,
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
