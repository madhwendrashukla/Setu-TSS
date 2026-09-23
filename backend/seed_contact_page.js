/**
 * seed_contact_page.js
 *
 * Seeds/updates the contact_page_content table with default Support & Contact page content,
 * customizable action cards, course problem banner, and info checklist box.
 *
 * Usage:
 *   node seed_contact_page.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

function defaultActionCards() {
  return [
    {
      id: randomUUID(),
      title: 'WhatsApp community',
      description: 'Ask questions and meet other founders.',
      button_text: 'Open community →',
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

async function main() {
  const existing = await prisma.contactPageContent.findFirst();
  if (existing) {
    console.log('🔄 contact_page_content row exists — updating with new default cards if empty...');
    await prisma.contactPageContent.update({
      where: { id: existing.id },
      data: {
        title: existing.title || 'Support & <span class="text-[#7C3AED]">Contact</span>',
        description: existing.description || "Stuck on something? We're one message away.",
        back_btn_text: existing.back_btn_text || '← Back',
        back_btn_link: existing.back_btn_link || '/',
        action_cards: Array.isArray(existing.action_cards) && existing.action_cards.length > 0 ? existing.action_cards : defaultActionCards(),
        show_problem_banner: existing.show_problem_banner !== false,
        problem_banner_title: existing.problem_banner_title || 'Found a problem in a course?',
        problem_banner_desc: existing.problem_banner_desc || "Report a mistake, broken link, or wrong date — pick the course and we'll get a ticket.",
        problem_banner_action_text: existing.problem_banner_action_text || 'Enroll in a course to report an issue.',
        problem_banner_action_url: existing.problem_banner_action_url || '/courses',
        problem_banner_icon: existing.problem_banner_icon || 'fas fa-flag',
        show_info_box: existing.show_info_box !== false,
        info_box_title: existing.info_box_title || 'When should you contact us?',
        info_box_icon: existing.info_box_icon || 'fas fa-question-circle',
        info_box_items: Array.isArray(existing.info_box_items) && existing.info_box_items.length > 0 ? existing.info_box_items : defaultInfoBoxItems(),
      },
    });
    console.log('✅ contact_page_content updated successfully!');
    return;
  }

  const content = await prisma.contactPageContent.create({
    data: {
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
      social_links: [],
      faqs: [],
    },
  });

  console.log('✅ contact_page_content seeded successfully! ID:', content.id);
}

main()
  .catch((e) => {
    console.error('❌ Error in seed script:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
