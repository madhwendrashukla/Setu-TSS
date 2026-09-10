require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DPDP_PAGE_BLOCKS = {
  registrations_open: true,
  section_visibility: {
    hero: true,
    story: true,
    output: true,
    workshops: true, // We'll use workshops for the single session to show what you'll learn
    pricing: true,
    mentors: true,
    video_gallery: false,
    text_testimonials: false,
    video_testimonials: false,
    faqs: false,
    contact: true,
  },

  hero: {
    top_badge: 'Upcoming Event · September 2026',
    headline: 'Is Your Startup Breaking India\'s Data Privacy Rules?',
    description: 'Understand what the DPDP Act means for your startup, avoid common data privacy mistakes, and learn practical steps to become DPDP ready.',
    key_highlights: [
      '1 Hour Live Session',
      'Free Registration',
      'Practical, founder-focused (no legal jargon)',
      'For Founders, Tech Leaders & Compliance Teams'
    ],
  },

  story: {
    visible: true,
    headline: 'Are you prepared for India\'s Data Privacy Rules?',
    description: 'Your startup probably collects more personal data than you realise: Names, Phone numbers, Email addresses, Customer info, Employee info, Website data, App data. But do you know what your startup is actually expected to do with that data?',
    boxes: [
      {
        title: 'The Risk',
        description: 'The Digital Personal Data Protection (DPDP) framework is becoming increasingly important for businesses operating in India. Ignoring it is no longer an option.',
        bullets: [
          { text: 'Not knowing how DPDP applies to your business', style: 'cross' },
          { text: 'Unaware of risks from employees & third-party vendors', style: 'cross' },
          { text: 'Making common data privacy mistakes', style: 'cross' },
        ],
      },
      {
        title: 'The Solution',
        description: 'Join us for a practical, founder-focused session where we break down DPDP and data privacy in simple language — without unnecessary legal jargon.',
        bullets: [
          { text: 'Understand consent and notice in practice', style: 'check' },
          { text: 'Review what your website/app needs', style: 'check' },
          { text: 'Take practical first steps towards DPDP readiness', style: 'check' },
        ],
      },
    ],
  },

  output: {
    image_url: '',
    headline: {
      text: 'Who Should Attend?',
      color: '#7C3AED',
    },
    bullets: [
      'Startup Founders & Co-founders',
      'Early stage Startups',
      'SaaS & Technology Companies',
      'App & Product Companies',
      'D2C & E-commerce Businesses',
      'Product & Operations Teams',
      'CTOs & Technology Leaders',
      'Legal & Compliance Teams',
      'HR & People Teams'
    ],
  },

  workshops: [
    {
      id: 'dpdp-session',
      priority_order: 1,
      heading: 'Free Session',
      title: 'A Founder\'s Guide to DPDP',
      key_features: '1 hour · Online (Zoom) · Live Q&A',
      detail_bullets: {
        what_youll_learn: [
          'Whether and how the DPDP framework may apply to your business',
          'What types of personal data your startup may be handling',
          'What founders should consider before collecting personal data',
          'Consent and notice — what they mean in practice',
          'What your website/app may need to review',
          'How employees and third-party vendors can create data privacy risks',
          'What to think about when sharing data with external platforms',
          'Common data privacy mistakes startups make',
          'Practical first steps towards DPDP readiness'
        ],
        your_deliverables: [
          'Clarity on DPDP compliance for your startup',
          'Actionable steps to avoid data privacy mistakes',
          'Answers to your queries during the session'
        ],
      },
      pricing: {
        strike_price: 0,
        actual_price: 0,
        date_time_bullets: ['Saturday, September 12, 2026', '11:00 AM – 12:00 PM (IST)', 'Live on Zoom'],
        mode: 'online',
        address: null,
      },
      cta: { text: 'Reserve a spot', active: true },
      visible: true,
      color: '#0EA5E9',
      icon: '🛡️',
      badge: 'Live Session',
    }
  ],

  pricing_options: [
    {
      id: 'dpdp-free-ticket',
      priority_order: 1,
      heading: 'Registration',
      title: 'Free Workshop Access',
      key_features: '1 hour session · Practical insights · Expert guidance',
      pricing: {
        strike_price: 0,
        actual_price: 0,
        date_time_bullets: ['September 12, 2026', '11:00 AM – 12:00 PM IST', 'Online (Zoom)'],
        mode: 'online',
      },
      cta: { text: 'Reserve a spot', active: true },
      visible: true,
    }
  ],

  mentors: {
    section_headline: 'Meet Your Speakers',
    items: [
      {
        id: 'mentor-dpdp-paakhhi',
        image_url: '',
        name: 'Paakhhi Garg',
        professional_headline: 'Director - Data Privacy Practice, World Cyber Security Forum',
        professional_description: 'Paakhhi is an expert in data privacy and cybersecurity with extensive experience in consulting top enterprises and startups on compliance and data protection frameworks.',
        credential_bullets: [
          'Director at World Cyber Security Forum',
          'Ex - PwC & Gartner',
          'Specialist in DPDP compliance'
        ],
        visible: true,
        color: '#7C3AED',
        imagePosition: 'center',
        badge_text: 'Data Privacy Expert',
      },
      {
        id: 'mentor-dpdp-gaurav',
        image_url: '',
        name: 'Gaurav Bansal',
        professional_headline: 'Founder, SETU Startup School',
        professional_description: 'Gaurav has guided hundreds of founders from ideation to execution. He focuses on simplifying complex topics for startup founders to ensure they build robust, scalable businesses.',
        credential_bullets: [
          'Founder, Setu Startup School',
          'Ex - Startup Mentor at IIT Delhi & IIT Madras',
          'Ex - Startup Mentor at IIM Rohtak'
        ],
        visible: true,
        color: '#0EA5E9',
        imagePosition: 'center',
        badge_text: 'Startup Mentor',
      }
    ],
  },

  video_gallery: { headline: null, videos: [] },
  text_testimonials: [],
  video_testimonials: [],
  faqs: [],

  contact: {
    whatsapp: {
      headline: 'Have Queries?',
      description: 'Interested in joining this workshop or if you have any queries, do join the whatsapp group link below:',
      button_text: 'Join WhatsApp Group',
      link: 'https://chat.whatsapp.com/DQ30MdpecC219ox7C8rCOv',
    },
    lead_form: {
      headline: 'Stay Updated',
      subtext: 'Register your interest for our upcoming sessions.',
      submit_text: 'Notify Me',
      destination_email: 'info@thestartupschool.in',
      destination_contact_number: '',
    },
  },

  coupon: { code: '', discount_percent: 0, active: false },
  extras: {
    workshop_nudges: { enabled: true, frequency_sections: 2 },
    footer: '© 2026 The Startup School. All rights reserved.',
    chatbot: { enabled: false, note: '' },
  },
};

(async () => {
  try {
    const slug = 'DPDP-Act-Startups-12Sept26';
    
    // Check if event exists
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) {
      console.log(`Event with slug ${slug} not found!`);
      process.exit(1);
    }
    
    await prisma.event.update({
      where: { slug },
      data: {
        title: 'Is Your Startup Breaking India\'s Data Privacy Rules?',
        description: 'A Practical Founder\'s Guide to Data Privacy Compliance',
        page_blocks: DPDP_PAGE_BLOCKS,
        venue: 'Online (Zoom)',
        city: 'Online',
        start_time: '11:00 AM',
        end_time: '12:00 PM',
        is_active: true
      }
    });
    console.log('Successfully created builder page blocks for DPDP event.');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
})();
