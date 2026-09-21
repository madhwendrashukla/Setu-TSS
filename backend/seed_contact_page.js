/**
 * seed_contact_page.js
 *
 * Seeds the contact_page_content table with default Contact Us page content,
 * rich text descriptions, lead collection tag, direct reach info, social links, and FAQs.
 *
 * Usage:
 *   node seed_contact_page.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.contactPageContent.findFirst();
  if (existing) {
    console.log('✅ contact_page_content row already exists — skipping seed.');
    console.log('   id:', existing.id);
    return;
  }

  const content = await prisma.contactPageContent.create({
    data: {
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

      social_links: [
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
      ],

      show_founder_card: true,
      founder_name: 'Gaurav Bansal',
      founder_title: 'Founder & Chief Mentor • Setu Startup School',
      founder_tag: 'Founder Profile',
      founder_photo_url: '/gaurav.webp',
      founder_link: '/gauravbansal',

      show_faqs: true,
      faqs: [
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
      ],
    },
  });

  console.log('✅ contact_page_content seeded successfully! ID:', content.id);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding contact page content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
