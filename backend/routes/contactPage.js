const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const { randomUUID } = require('crypto');

// ────────────────────────────────────────────────────────────────────────────
// Defaults & Helpers
// ────────────────────────────────────────────────────────────────────────────

function defaultActionCards() {
  return [
    {
      id: randomUUID(),
      title: 'WhatsApp community',
      description: 'Ask questions and meet other founders.',
      button_text: 'Open community →',
      button_url: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
      action_type: 'whatsapp', // 'whatsapp' | 'url' | 'email' | 'phone' | 'feedback_modal' | 'inquiry_modal'
      icon: 'users',
      badge: 'Community',
      display_order: 0,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Message us on WhatsApp',
      description: 'Fastest way to reach the team.',
      button_text: 'Send a message →',
      button_url: 'https://wa.me/919289121121',
      action_type: 'whatsapp',
      icon: 'message',
      badge: 'Direct Message',
      display_order: 1,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Book a 1-on-1 call',
      description: 'Talk to a mentor about your startup.',
      button_text: 'Book a slot →',
      button_url: 'https://topmate.io',
      action_type: 'url',
      icon: 'calendar',
      badge: 'Mentorship',
      display_order: 2,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Give feedback',
      description: 'Tell us what is working and what is not.',
      button_text: 'Share feedback →',
      button_url: '',
      action_type: 'feedback_modal',
      icon: 'feedback',
      badge: 'Feedback',
      display_order: 3,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Email us',
      description: 'We reply within one working day.',
      button_text: 'Email support →',
      button_url: 'mailto:info@setustartupschool.com',
      action_type: 'inquiry_modal',
      icon: 'mail',
      badge: 'Support Desk',
      display_order: 4,
      is_active: true,
    },
    {
      id: randomUUID(),
      title: 'Call Us Now !!!',
      description: 'call on this number - +91 92891 21121',
      button_text: 'Call now →',
      button_url: 'tel:+919289121121',
      action_type: 'phone',
      icon: 'phone',
      badge: 'Helpline',
      display_order: 5,
      is_active: true,
    },
  ];
}

function defaultInfoBoxItems() {
  return [
    {
      id: randomUUID(),
      text: "You can't access a course you paid for, or a lesson won't load.",
      display_order: 0,
      is_active: true,
    },
    {
      id: randomUUID(),
      text: "A live session's meeting link is missing or not working.",
      display_order: 1,
      is_active: true,
    },
    {
      id: randomUUID(),
      text: 'You have a question about the course content and want to ask a mentor.',
      display_order: 2,
      is_active: true,
    },
    {
      id: randomUUID(),
      text: 'Payment, invoice, or refund questions.',
      display_order: 3,
      is_active: true,
    },
    {
      id: randomUUID(),
      text: "Your certificate has a typo or didn't appear after finishing the course.",
      display_order: 4,
      is_active: true,
    },
  ];
}

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
        title: 'Support & <span class="text-[#7C3AED]">Contact</span>',
        description: "Stuck on something? We're one message away.",
        back_btn_text: '← Back',
        back_btn_link: '/',
        action_cards: defaultActionCards(),
        show_problem_banner: true,
        problem_banner_title: 'Found a problem in a course?',
        problem_banner_desc: "Report a mistake, broken link, or wrong date — pick the course and we'll get a ticket.",
        problem_banner_action_text: 'Enroll in a course to report an issue.',
        problem_banner_action_url: '/courses',
        problem_banner_icon: 'fas fa-flag',
        show_info_box: true,
        info_box_title: 'When should you contact us?',
        info_box_icon: 'fas fa-question-circle',
        info_box_items: defaultInfoBoxItems(),
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

    // Filter active social links and sort by display_order
    let socialLinks = Array.isArray(content.social_links) ? content.social_links : defaultSocialLinks();
    socialLinks = socialLinks
      .filter(l => l && l.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    // Filter active FAQs and sort by display_order
    let faqs = Array.isArray(content.faqs) ? content.faqs : defaultFaqs();
    faqs = faqs
      .filter(f => f && f.is_active !== false)
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    res.json({
      ...content,
      title: content.title || 'Support & <span class="text-[#7C3AED]">Contact</span>',
      description: content.description || "Stuck on something? We're one message away.",
      back_btn_text: content.back_btn_text || '← Back',
      back_btn_link: content.back_btn_link || '/',
      action_cards: actionCards,
      show_problem_banner: content.show_problem_banner !== false,
      problem_banner_title: content.problem_banner_title || 'Found a problem in a course?',
      problem_banner_desc: content.problem_banner_desc || "Report a mistake, broken link, or wrong date — pick the course and we'll get a ticket.",
      problem_banner_action_text: content.problem_banner_action_text || 'Enroll in a course to report an issue.',
      problem_banner_action_url: content.problem_banner_action_url || '/courses',
      problem_banner_icon: content.problem_banner_icon || 'fas fa-flag',
      show_info_box: content.show_info_box !== false,
      info_box_title: content.info_box_title || 'When should you contact us?',
      info_box_icon: content.info_box_icon || 'fas fa-question-circle',
      info_box_items: infoBoxItems,
      social_links: socialLinks,
      faqs: faqs,
    });
  } catch (error) {
    console.error('Failed to fetch public contact content:', error);
    // Fallback response with full defaults if database is temporarily unavailable
    res.json({
      badge_text: "Get in Touch • We're Here For You",
      title: 'Support & <span class="text-[#7C3AED]">Contact</span>',
      description: "Stuck on something? We're one message away.",
      back_btn_text: '← Back',
      back_btn_link: '/',
      action_cards: defaultActionCards(),
      show_problem_banner: true,
      problem_banner_title: 'Found a problem in a course?',
      problem_banner_desc: "Report a mistake, broken link, or wrong date — pick the course and we'll get a ticket.",
      problem_banner_action_text: 'Enroll in a course to report an issue.',
      problem_banner_action_url: '/courses',
      problem_banner_icon: 'fas fa-flag',
      show_info_box: true,
      info_box_title: 'When should you contact us?',
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
      founder_name: 'Gaurav Bansal',
      founder_title: 'Founder & Chief Mentor • Setu Startup School',
      founder_tag: 'Founder Profile',
      founder_photo_url: '/gaurav.webp',
      founder_link: '/gauravbansal',
      show_faqs: false,
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
