// ─────────────────────────────────────────────────────────────────────────────
// seed-past-events-data.js
//
// DATA FILE — no Prisma, no side effects.
// Sourced from live pages on 2026-09-10:
//   https://thestartupschool.in/fundraising-workshop-15apr
//   https://thestartupschool.in/AI-workshop-15may
//
// Run the seed with:
//   node scripts/seed-past-events.js --dry-run   ← preview, no DB writes
//   node scripts/seed-past-events.js              ← real insert
// ─────────────────────────────────────────────────────────────────────────────

const PAST_EVENTS = [

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT 1 — Fundraising Workshop (15–19 Apr 2026)
  // URL: https://thestartupschool.in/fundraising-workshop-15apr
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title:            'Fundraising Workshop',
    description:      'Stop guessing what investors want. A live, cohort-based program that transforms passionate builders into investable founders — covering term sheets, cap tables, pitch decks, and investor outreach.',
    slug:             'fundraising-workshop-15apr',
    banner_url:       '',   // TODO: add S3 banner URL if available
    venue:            'Live on Zoom',
    city:             'Online',
    start_date:       new Date('2026-04-15'),
    start_time:       '6:00 PM',
    end_date:         new Date('2026-04-19'),
    end_time:         '6:30 PM',
    registration_url: '',
    is_past:          true,
    is_pinned:        false,
    is_active:        true,
    lms_course_slug:  null,

    page_blocks: {
      registrations_open: false,

      section_visibility: {
        hero:               true,
        story:              true,
        output:             true,
        workshops:          true,
        pricing:            true,
        mentors:            true,
        video_gallery:      false,
        text_testimonials:  false,
        video_testimonials: false,
        faqs:               true,
        contact:            true,
      },

      hero: {
        top_badge:   'Past Event · April 2026',
        headline:    'From Founder to Fundable',
        description: 'Stop guessing what investors want. Join the live, cohort-based program that transforms passionate builders into investable founders.',
        key_highlights: [
          'Complete fundraising process — start to close',
          'Term sheets, SHA, cap table deep-dive',
          'Pitch deck prep + live pitching practice',
          '80+ pitch decks that actually raised money',
          'Investor database & incubator access',
          '1-year free community membership',
        ],
      },

      story: {
        visible:     true,
        headline:    'Two Types of Founders — Which Are You?',
        description: 'In the startup ecosystem, there are two types of founders. The difference isn\'t talent — it\'s preparation.',
        boxes: [
          {
            title:       'Founder 1: Passionate but Unprepared',
            description: 'Builds relentlessly but feels completely lost when it\'s time to raise capital.',
            bullets: [
              { text: 'Walks into investor meetings with vision, no structured narrative', style: 'cross' },
              { text: 'Stumbles over unit economics, dreads the "Data Room" request',      style: 'cross' },
              { text: 'Signs restrictive deals — doesn\'t know the rules of the game',     style: 'cross' },
            ],
          },
          {
            title:       'Founder 2: The Prepared Architect',
            description: 'Builds an investable company structure, not just a great product.',
            bullets: [
              { text: 'Understands term sheets & uses financial models to prove growth',   style: 'check' },
              { text: 'Knows 90% of what investors will ask before they open their mouths', style: 'check' },
              { text: 'Negotiates a strategic partnership from a position of leverage',    style: 'check' },
            ],
          },
        ],
      },

      output: {
        image_url: '',
        headline: {
          text:  'Everything You Take Home',
          color: '#7C3AED',
        },
        bullets: [
          'Complete fundraising process roadmap',
          'Data room checklist & documents list',
          'Cap table model & financial jargon glossary',
          'Pitch deck template (proven structure)',
          '80+ pitch decks that actually raised money',
          'Investor database access',
          'List of incubators & accelerators',
          '1-year free community membership',
          'Certificate of Participation (Basic + Advanced)',
        ],
      },

      workshops: [
        {
          id:             'fw-level-1',
          priority_order: 1,
          heading:        'Level 1',
          title:          'Fund Raising Basics',
          key_features:   'Fundraising process · Data room · Pitch deck · Term sheet intro · Cap table · Legal basics',
          detail_bullets: {
            what_youll_learn: [
              'Introduction to the complete fundraising process',
              'Data room preparation & required documents',
              'All basic financial jargons and key terms',
              'Introduction to agreements — Term Sheet, SHA, and more',
              'Cap table management fundamentals',
              'Investor outreach strategies',
              'Pitch deck preparation and how to pitch effectively',
              'Legal compliance essentials for startups',
            ],
            your_deliverables: [
              'Certificate of Participation – Basic Level',
              'Access to tools and resources',
              'Fundraising process roadmap',
            ],
          },
          pricing: {
            strike_price:       0,   // TODO: fill actual prices if known
            actual_price:       0,   // TODO: fill actual prices if known
            date_time_bullets:  ['15th, 16th, 17th April 2026', '6:00 PM – 9:00 PM', 'Live on Zoom'],
            mode:               'online',
            address:            null,
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
          color:   '#7C3AED',
          icon:    '📊',
          badge:   'Level 1 – Basics',
        },
        {
          id:             'fw-level-2',
          priority_order: 2,
          heading:        'Level 2',
          title:          'Fund Raising Advanced',
          key_features:   'Term sheet deep-dive · SHA · ESOP · NDA · IP · Cap table advanced · Investor outreach roadmap',
          detail_bullets: {
            what_youll_learn: [
              'Term Sheet Basics — all key terms in the agreements',
              'Term Sheet Advanced — negotiation, conflict areas, protecting future rounds (with case studies)',
              'Key Agreements — SHA, ESOP, NDA, IP',
              'Cap Table Management — deep-dive on calculations',
              'Investor Outreach Roadmap — identify, connect and close the right investor',
            ],
            your_deliverables: [
              'Includes full access to Level 1',
              '80+ Pitch Decks That Actually Raised Money',
              'Access to Investor Database',
              'Access to List of Incubators and Accelerators',
              '1 Year Free Community Membership',
              'Free Access to Session on DPIIT Startup India Registration',
              'Updates to All Upcoming B2B Events',
              'Certificate of Participation – Advanced Level',
            ],
          },
          pricing: {
            strike_price:       0,   // TODO: fill actual prices if known
            actual_price:       0,   // TODO: fill actual prices if known
            date_time_bullets:  [
              '15th, 16th, 17th April 2026 · 6:00 PM – 9:00 PM',
              '18th & 19th April 2026 · 10:00 AM – 1:30 PM & 3:00 PM – 6:30 PM',
              'Live on Zoom',
            ],
            mode:               'online',
            address:            null,
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
          color:   '#0EA5E9',
          icon:    '🚀',
          badge:   'Level 2 – Advanced',
        },
      ],

      pricing_options: [
        {
          id:             'fw-price-basic',
          priority_order: 1,
          heading:        'Basic Cohort',
          title:          'The basics of capital and readiness',
          key_features:   '15th–17th April · 6–9 PM · Live on Zoom',
          pricing: {
            strike_price:       0,   // TODO: add actual prices if known
            actual_price:       0,
            date_time_bullets:  ['15th, 16th, 17th April 2026', '6:00 PM – 9:00 PM', 'Live on Zoom'],
            mode:               'online',
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
        },
        {
          id:             'fw-price-advanced',
          priority_order: 2,
          heading:        'Advanced Cohort',
          title:          'Full deep dive + Special Benefits',
          key_features:   '15th–19th April · Live on Zoom · 100+ pitch decks · Investor DB · 1-yr membership',
          pricing: {
            strike_price:       0,   // TODO: add actual prices if known
            actual_price:       0,
            date_time_bullets:  [
              '15–17 April: 6:00 PM – 9:00 PM',
              '18–19 April: 10:00 AM – 1:30 PM & 3:00 PM – 6:30 PM',
              'Live on Zoom',
            ],
            mode:               'online',
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
        },
      ],

      mentors: {
        section_headline: 'Learn from Experts',
        items: [
          {
            id:                       'mentor-fw-gaurav',
            image_url:                '',   // TODO: S3 photo URL for Gaurav Bansal
            name:                     'Gaurav Bansal',
            professional_headline:    'Founder – The Startup School',
            professional_description: 'To master fundraising, you must speak three languages: The Narrative, The Numbers, and The Law. Gaurav will guide you through the exact execution strategies needed to build an investable company and secure your funding rounds with clarity.',
            credential_bullets: [
              'Mentor at E-Cell IIT Madras',
              'Ex-Mentor – IIM-R, IIT-D, DU, AIM',
              'Guest speaker at 10+ B-schools',
              'Expert in strategy & startup building',
            ],
            visible:       true,
            color:         '#7C3AED',
            imagePosition: 'center',
            badge_text:    'Lead Mentor',
          },
          {
            id:                       'mentor-fw-ashish',
            image_url:                '',   // TODO: S3 photo URL
            name:                     'Ashish Kulkarni',
            professional_headline:    'Founder, Founders\' Psyche | Former Research Assistant, INSEAD',
            professional_description: 'An MBA graduate from IE Business School, Spain, Ashish brings deep expertise in fundraising and entrepreneurship. As an ex-cofounder of Fundenable and a former VC scout, he has operated on both sides of the fundraising ecosystem.',
            credential_bullets: [
              'Ex-cofounder, Fundenable',
              'Former VC Scout',
              'MBA – IE Business School, Spain',
              'Former Research Assistant, INSEAD',
            ],
            visible:       true,
            color:         '#0EA5E9',
            imagePosition: 'center',
            badge_text:    'Fundraising Expert',
          },
          {
            id:                       'mentor-fw-poornima',
            image_url:                '',   // TODO: S3 photo URL
            name:                     'Poornima Goel',
            professional_headline:    'Corporate Lawyer | Specializing in M&A & Private Equity',
            professional_description: 'Poornima specializes in General Corporate, M&A, and Private Equity, with a focus on helping businesses navigate legal frameworks and structuring agreements, ensuring regulatory readiness.',
            credential_bullets: [
              'Corporate lawyer specialising in M&A & PE',
              'Expert in SHA, ESOP, NDA & IP agreements',
              'Startup legal compliance specialist',
            ],
            visible:       true,
            color:         '#10B981',
            imagePosition: 'center',
            badge_text:    'Legal Expert',
          },
          {
            id:                       'mentor-fw-gmishra',
            image_url:                '',   // TODO: S3 photo URL
            name:                     'Gaurav Mishra',
            professional_headline:    'FRM Professional | MDI-Gurgaon Alumnus | Finance Expert',
            professional_description: 'A certified FRM professional and MBA graduate from MDI-Gurgaon, Gaurav brings strong expertise in startup valuation and financial forecasting. His experience at Ernst & Young adds significant corporate depth.',
            credential_bullets: [
              'Certified FRM Professional',
              'MBA – MDI Gurgaon',
              'Ex-Ernst & Young',
              'Expert in startup valuation & financial forecasting',
            ],
            visible:       true,
            color:         '#F59E0B',
            imagePosition: 'center',
            badge_text:    'Finance Expert',
          },
        ],
      },

      video_gallery:      { headline: null, videos: [] },
      text_testimonials:  [],
      video_testimonials: [],

      faqs: [
        {
          id:             'fw-faq-1',
          priority_order: 1,
          question:       'What is the transformation this workshop delivers?',
          answer:         'You will stop treating fundraising like a lottery and master it as a repeatable system.',
          visible:        true,
        },
        {
          id:             'fw-faq-2',
          priority_order: 2,
          question:       'Who is the Basic Cohort for?',
          answer:         'Anyone stepping into the world of startup fundraising. You will walk away with a clear roadmap of the fundraising landscape — covering process, pitch decks, cap tables and key financial terms.',
          visible:        true,
        },
        {
          id:             'fw-faq-3',
          priority_order: 3,
          question:       'What does the Advanced Cohort add over Basic?',
          answer:         'The Advanced Cohort includes everything in Level 1 plus a deep dive into term sheet negotiation, SHA/ESOP/NDA/IP agreements, cap table calculations, an investor outreach roadmap, 80+ pitch decks that actually raised money, investor database, incubator & accelerator list, and 1 year of free community membership.',
          visible:        true,
        },
        {
          id:             'fw-faq-4',
          priority_order: 4,
          question:       'Is the session live or recorded?',
          answer:         'All sessions are live on Zoom. Registered participants receive access to recordings.',
          visible:        true,
        },
        {
          id:             'fw-faq-5',
          priority_order: 5,
          question:       'Will there be another fundraising workshop?',
          answer:         'Yes! We run fundraising workshops regularly. Stay updated by joining our WhatsApp community or watching our events page.',
          visible:        true,
        },
      ],

      contact: {
        whatsapp: {
          headline:    'Have Questions?',
          description: 'Get instant replies for your queries directly from our team.',
          button_text: 'Message Now',
          link:        'https://chat.whatsapp.com/DsWZ7dyfz4C5bB4QydtNqH?mode=gi_t',
        },
        lead_form: {
          headline:                   'Stay Updated',
          subtext:                    'Register your interest for our next fundraising session.',
          submit_text:                'Notify Me',
          destination_email:          'info@thestartupschool.in',
          destination_contact_number: '',
        },
      },

      coupon:  { code: '', discount_percent: 0, active: false },
      extras: {
        workshop_nudges: { enabled: false, frequency_sections: 3 },
        footer:          '© 2026 The Startup School. All rights reserved.',
        chatbot:         { enabled: false, note: '' },
      },
    },
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT 2 — AI Entrepreneurship Workshop Series (May 15–17, 2026)
  // URL: https://thestartupschool.in/AI-workshop-15may
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title:            'AI Entrepreneurship Workshop Series – May 15–17, 2026',
    description:      'From billion-dollar ideas to AI-powered MVPs in 3 days. Live on Zoom. Three workshops: Startup Ideation & Validation, Mastering AI with Claude Pro, and AI Filmmaking & Video Marketing.',
    slug:             'AI-workshop-15may',
    banner_url:       '',   // TODO: add S3 banner URL if available
    venue:            'Live on Zoom',
    city:             'Online',
    start_date:       new Date('2026-05-15'),
    start_time:       '6:00 PM',
    end_date:         new Date('2026-05-17'),
    end_time:         '5:30 PM',
    registration_url: '',
    is_past:          true,
    is_pinned:        false,
    is_active:        true,
    lms_course_slug:  null,

    page_blocks: {
      registrations_open: false,

      section_visibility: {
        hero:               true,
        story:              true,
        output:             true,
        workshops:          true,
        pricing:            true,
        mentors:            true,
        video_gallery:      false,
        text_testimonials:  true,
        video_testimonials: false,
        faqs:               true,
        contact:            true,
      },

      hero: {
        top_badge:   'Past Event · May 2026',
        headline:    'Build Validate and Launch your Startup in 3 Days',
        description: 'From billion-dollar ideas to AI-powered MVPs in 3 days. Live on Zoom. Validate it. Build it. Market it — all in one weekend with experts who\'ve done it.',
        key_highlights: [
          '3 days · 5 sessions · 13 total hours',
          'Startup ideation with 12 proven methods',
          'Build a working MVP with Claude Pro — no coding required',
          'Create a professional AI marketing film',
          'Live & interactive — real-time Q&A with mentors',
          '3 Certificates of Participation',
        ],
      },

      story: {
        visible:     true,
        headline:    'You Get Stuck in the Loop. This Breaks It in 3 Days.',
        description: 'It starts with an idea. Then doubt creeps in. Learn → Doubt → Delay. Learn more → Doubt more → Delay more. Weeks pass. The idea lives only in your head — and slowly, it fades. What if you broke the loop?',
        boxes: [
          {
            title:       'The Trap Most Founders Are In',
            description: 'Watching tutorials, reading books, attending webinars — but nothing actually ships.',
            bullets: [
              { text: 'Idea stays stuck in your head',              style: 'cross' },
              { text: 'Analysis paralysis from too much learning',  style: 'cross' },
              { text: 'No validated business model or prototype',   style: 'cross' },
            ],
          },
          {
            title:       'What You Get in 3 Days',
            description: 'Instead of watching someone talk about startups, you actually build one. Validated. Prototyped. Marketed — with AI as your co-founder.',
            bullets: [
              { text: 'Validated billion-dollar idea using 12 frameworks', style: 'check' },
              { text: 'Working MVP prototype built live',                  style: 'check' },
              { text: 'AI-generated professional marketing film',          style: 'check' },
            ],
          },
        ],
      },

      output: {
        image_url: '',
        headline: {
          text:  'What You Ship by the End of 3 Days',
          color: '#0EA5E9',
        },
        bullets: [
          'Validated Business Idea — 12 proven ideation methods applied, market-tested concept ready to build',
          'Working MVP Prototype — functional landing page or app, built during the workshop',
          'AI-Generated Marketing Film — complete 30-60 second video, professional quality content',
          'Market Research Report — competitor analysis complete, customer personas defined',
          'Prompt Templates & Workflows — reusable AI frameworks, copy-paste ready templates',
          '3 Certificates of Completion — professional credentials, LinkedIn-ready certificates',
        ],
      },

      workshops: [
        {
          id:             'ai-w1',
          priority_order: 1,
          heading:        'Workshop 1',
          title:          'Startup Ideation & Validation',
          key_features:   '12 ideation methods · Business model canvas · Market validation checklist · Certificate',
          detail_bullets: {
            what_youll_learn: [
              '12 Proven Methods to Generate Billion-Dollar Ideas — from passion projects to market gaps; how Uber, Airbnb & Notion found breakthrough ideas',
              'The Validation Framework — stop building products nobody wants; test your idea before writing a single line of code; market sizing and demand validation techniques',
              'From Idea to Action Plan — convert rough concepts into executable business models; risk assessment and competitive positioning; build your first business canvas',
            ],
            your_deliverables: [
              '12-method ideation framework',
              'Validated business idea',
              'One-page business model canvas',
              'Market validation checklist',
              'Certificate of Participation',
            ],
          },
          pricing: {
            strike_price:       0,   // TODO: add price if known
            actual_price:       0,
            date_time_bullets:  ['May 15, 2026 (Thursday)', '6:00 PM – 9:00 PM IST', 'Live on Zoom'],
            mode:               'online',
            address:            null,
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
          color:   '#7C3AED',
          icon:    '💡',
          badge:   'Workshop 1',
          mentor:  'Gaurav Bansal',
          sessions: [
            {
              title:      'Startup Ideation & Validation',
              date:       'May 15, 2026',
              start_time: '6:00 PM',
              end_time:   '9:00 PM',
            },
          ],
        },
        {
          id:             'ai-w2',
          priority_order: 2,
          heading:        'Workshop 2',
          title:          'Mastering AI with Claude Pro for Startups',
          key_features:   'AI-powered market research · Build working MVP prototype · Prompt templates & workflows · Certificate',
          detail_bullets: {
            what_youll_learn: [
              'How to use Claude Pro for no-code/low-code MVP development',
              'AI-powered market research — customer discovery at 10× speed',
              'Build a working landing page or app prototype entirely with AI',
              'Prompt engineering for business: templates and reusable workflows',
              'Automate repetitive startup tasks using AI agents',
            ],
            your_deliverables: [
              'Working MVP prototype (landing page or app)',
              'AI-powered market research report',
              'Prompt templates & Claude Pro workflow library',
              'Certificate of Participation',
            ],
          },
          pricing: {
            strike_price:       0,
            actual_price:       0,
            date_time_bullets:  [
              'Session 1 — May 16, 2026 · 10:00 AM – 12:30 PM',
              'Session 2 — May 16, 2026 · 3:00 PM – 5:30 PM',
              'Session 3 — May 17, 2026 · 3:00 PM – 5:30 PM',
              'Live on Zoom',
            ],
            mode:               'online',
            address:            null,
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
          color:   '#0EA5E9',
          icon:    '🤖',
          badge:   'Workshop 2',
          mentor:  'Atul Pandey',
          sessions: [
            { title: 'Mastering AI with Claude Pro – Session 1', date: 'May 16, 2026', start_time: '10:00 AM', end_time: '12:30 PM' },
            { title: 'Mastering AI with Claude Pro – Session 2', date: 'May 16, 2026', start_time: '3:00 PM',  end_time: '5:30 PM'  },
            { title: 'Mastering AI with Claude Pro – Session 3', date: 'May 17, 2026', start_time: '3:00 PM',  end_time: '5:30 PM'  },
          ],
        },
        {
          id:             'ai-w3',
          priority_order: 3,
          heading:        'Workshop 3',
          title:          'AI Filmmaking & Video Marketing Masterclass',
          key_features:   'Create complete AI film using Claude Pro · Script + prompts + all assets · Repeatable production workflow · Certificate',
          detail_bullets: {
            what_youll_learn: [
              'Create a complete 30–60 second professional marketing film using AI — no video editing experience needed',
              'Script writing with AI: structuring a compelling brand story',
              'AI image & video generation: best tools and prompts',
              'Voiceover, subtitles and post-production — all with AI',
              'Build a repeatable content production workflow for your startup',
            ],
            your_deliverables: [
              'Complete AI-generated marketing film (30–60 seconds)',
              'Script + image prompts + all creative assets',
              'Repeatable AI video production workflow',
              'Certificate of Participation',
            ],
          },
          pricing: {
            strike_price:       0,
            actual_price:       0,
            date_time_bullets:  ['May 17, 2026 (Saturday)', '10:00 AM – 1:00 PM IST', 'Live on Zoom'],
            mode:               'online',
            address:            null,
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
          color:   '#10B981',
          icon:    '🎬',
          badge:   'Workshop 3',
          mentor:  'Amey Asuti',
          sessions: [
            {
              title:      'AI Filmmaking & Video Marketing',
              date:       'May 17, 2026',
              start_time: '10:00 AM',
              end_time:   '1:00 PM',
            },
          ],
        },
      ],

      pricing_options: [
        {
          id:             'ai-price-w1',
          priority_order: 1,
          heading:        'Startup Ideation & Validation',
          title:          'by Gaurav Bansal',
          key_features:   '12 ideation methods · Business model canvas · Market validation checklist · Certificate',
          pricing: {
            strike_price:       0,   // TODO: add actual prices if known
            actual_price:       0,
            date_time_bullets:  ['May 15, 2026', '6:00 PM – 9:00 PM', 'Live on Zoom'],
            mode:               'online',
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
        },
        {
          id:             'ai-price-w2',
          priority_order: 2,
          heading:        'Zero-to-MVP using Claude Pro',
          title:          'by Atul Pandey',
          key_features:   'AI-powered market research · Build working MVP prototype · Prompt templates & workflows · Certificate',
          pricing: {
            strike_price:       0,
            actual_price:       0,
            date_time_bullets:  ['May 16–17, 2026 · 3 sessions', 'Live on Zoom'],
            mode:               'online',
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
        },
        {
          id:             'ai-price-w3',
          priority_order: 3,
          heading:        'AI Filmmaking & Video Marketing',
          title:          'by Amey Asuti',
          key_features:   'Create complete AI film using Claude Pro · Script + prompts + all assets · Repeatable workflow · Certificate',
          pricing: {
            strike_price:       0,
            actual_price:       0,
            date_time_bullets:  ['May 17, 2026', '10:00 AM – 1:00 PM', 'Live on Zoom'],
            mode:               'online',
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
        },
        {
          id:             'ai-price-bundle',
          priority_order: 4,
          heading:        'Complete AI Launchpad (All 3 Workshops)',
          title:          'by All 3 Mentors',
          key_features:   'Full Access: Workshop 1 + 2 + 3 · All deliverables, templates & prompts · 3 Certificates',
          pricing: {
            strike_price:       0,
            actual_price:       0,
            date_time_bullets:  ['May 15–17, 2026', '3 days · 5 sessions · 13 hours', 'Live on Zoom'],
            mode:               'online',
          },
          cta:     { text: 'Registrations Closed', active: false },
          visible: true,
        },
      ],

      mentors: {
        section_headline: 'Three Domain Experts, One Comprehensive System',
        items: [
          {
            id:                       'mentor-ai-gaurav',
            image_url:                '',   // TODO: S3 photo URL
            name:                     'Gaurav Bansal',
            professional_headline:    'Founder – The Startup School',
            professional_description: 'Gaurav Bansal is the founder of The Startup School, an alternate B-school for aspiring entrepreneurs. With extensive experience mentoring at premier institutions, Gaurav has guided hundreds of founders from ideation to execution.',
            credential_bullets: [
              'Mentor at E-Cell IIT Madras',
              'Ex-Mentor – IIM-R, IIT-D, DU, AIM',
              'Guest speaker at 10+ B-schools',
              'Expert in strategy & startup building',
            ],
            visible:       true,
            color:         '#7C3AED',
            imagePosition: 'center',
            badge_text:    'Ideation & Validation',
          },
          {
            id:                       'mentor-ai-atul',
            image_url:                '',   // TODO: S3 photo URL
            name:                     'Atul Pandey',
            professional_headline:    'AI & Startup Technology Expert',
            professional_description: 'Atul Pandey specializes in helping non-technical founders leverage AI tools to build and scale their startups. He bridges the gap between entrepreneurship and technology, making AI accessible for everyone.',
            credential_bullets: [
              'Claude Pro implementation for business',
              'No-code/low-code MVP development',
              'AI-powered market research',
              'Product prototyping with AI',
            ],
            visible:       true,
            color:         '#0EA5E9',
            imagePosition: 'center',
            badge_text:    'AI & MVP Building',
          },
          {
            id:                       'mentor-ai-amey',
            image_url:                '',   // TODO: S3 photo URL
            name:                     'Amey Asuti',
            professional_headline:    'AI Filmmaking & Content Creation Specialist',
            professional_description: 'Amey Asuti is a pioneer in AI-powered content creation, helping entrepreneurs and creators produce professional-quality video content using cutting-edge AI tools.',
            credential_bullets: [
              'IIM-A alum with 19+ years of work experience',
              'Master in Audio & Video creation using AI tools',
              'Podcast Host, marketing & branding expert',
              'Expert in visual storytelling for brands',
            ],
            visible:       true,
            color:         '#10B981',
            imagePosition: 'center',
            badge_text:    'AI Filmmaking',
          },
        ],
      },

      video_gallery: { headline: null, videos: [] },

      text_testimonials: [
        {
          id:      'ai-t1',
          type:    'text',
          name:    'Loyan Dsouza',
          role:    'CSPO',
          company: 'Elevate',
          city:    'United Arab Emirates',
          rating:  10,
          quote:   'The kind of detail and the depth that especially the startup school has given, I think I would rate it as 10 out of 10. It was practical and actionable.',
          visible: true,
        },
        {
          id:      'ai-t2',
          type:    'text',
          name:    'Akanksha Bajaj',
          role:    'Director Marketing',
          company: 'ResearchAyu',
          city:    'Mumbai',
          rating:  5,
          quote:   'I really loved all the sessions because it felt like future planning for me. I\'m going to research more on the topics discussed. So yeah, really grateful for these sessions.',
          visible: true,
        },
        {
          id:      'ai-t3',
          type:    'text',
          name:    'Kush Bhatia',
          role:    'CEO & Co-Founder',
          company: 'JobGen.AI',
          city:    'Sydney',
          rating:  5,
          quote:   'From pitch deck to everything, I loved it. Your sessions have been very helpful in my journey. I really loved Ashish\'s session; it was one of my favorites.',
          visible: true,
        },
        {
          id:      'ai-t4',
          type:    'text',
          name:    'Shivay Shakti',
          role:    'Founder',
          company: 'MayaAgent.AI',
          city:    'New Delhi',
          rating:  5,
          quote:   'This is exceptional as you don\'t skip technical details that people struggle with. I really appreciate the depth. When I joined this session, it was beautiful. Thank you.',
          visible: true,
        },
      ],

      video_testimonials: [],

      faqs: [
        {
          id:             'ai-faq-1',
          priority_order: 1,
          question:       'What is the transformation this workshop delivers?',
          answer:         'Stop watching tutorials. Start building your startup in 3 days. You leave with a validated idea, a working MVP prototype, and a professional AI marketing film.',
          visible:        true,
        },
        {
          id:             'ai-faq-2',
          priority_order: 2,
          question:       'Do I need a technical background?',
          answer:         'No. The entire workshop series is designed for non-technical founders. Workshop 2 uses Claude Pro — a no-code AI tool — to build your MVP. Workshop 3 uses AI tools to create video content. Zero coding required.',
          visible:        true,
        },
        {
          id:             'ai-faq-3',
          priority_order: 3,
          question:       'Can I buy individual workshops instead of the full bundle?',
          answer:         'Yes. Each workshop is available individually. You can register for Startup Ideation & Validation, Zero-to-MVP using Claude Pro, or AI Filmmaking & Video Marketing separately, or get the Complete AI Launchpad bundle for all 3.',
          visible:        true,
        },
        {
          id:             'ai-faq-4',
          priority_order: 4,
          question:       'Are the sessions live or recorded?',
          answer:         'All sessions are live and interactive on Zoom — real-time Q&A with mentors, not pre-recorded lectures. Recordings are shared with registered participants.',
          visible:        true,
        },
        {
          id:             'ai-faq-5',
          priority_order: 5,
          question:       'Who is this workshop designed for?',
          answer:         'Aspiring entrepreneurs with an idea but don\'t know where to start. Early-stage founders who need validation and AI tools. Solopreneurs who need leverage. Corporate professionals transitioning into entrepreneurship. Students & recent graduates. Content creators who want to scale production with AI.',
          visible:        true,
        },
        {
          id:             'ai-faq-6',
          priority_order: 6,
          question:       'Will there be another AI workshop series?',
          answer:         'Yes! We run AI workshops regularly. Stay updated by joining our WhatsApp community or watching our events page.',
          visible:        true,
        },
      ],

      contact: {
        whatsapp: {
          headline:    'Have Questions?',
          description: 'Get instant replies for your queries directly from our team.',
          button_text: 'Message Now',
          link:        'https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t',
        },
        lead_form: {
          headline:                   'Stay Updated',
          subtext:                    'Register your interest for our next AI workshop.',
          submit_text:                'Notify Me',
          destination_email:          'info@thestartupschool.in',
          destination_contact_number: '',
        },
      },

      coupon:  { code: '', discount_percent: 0, active: false },
      extras: {
        workshop_nudges: { enabled: false, frequency_sections: 3 },
        footer:          '© 2026 The Startup School. All rights reserved.',
        chatbot:         { enabled: false, note: '' },
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT 3 — The StartUp Legal Playbook (11 Jul 2026)
  // Source: Luma event page (screenshots provided 2026-09-12)
  // Venue: Spotlight Strategic Partners, Mumbai
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title:            'The StartUp Legal Playbook',
    description:      'A founder-focused masterclass on term sheets, co-founder agreements, equity, dilution, and startup legal pitfalls with Khushboo Agrawal and Gaurav Bansal.',
    slug:             'startup-legal-playbook-11jul',
    banner_url:       'https://setu-tss-uploads.s3.ap-south-1.amazonaws.com/1789221733312-cropped.jpg',
    venue:            'Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East',
    city:             'Mumbai',
    start_date:       new Date('2026-07-11'),
    start_time:       '11:30 AM',
    end_date:         new Date('2026-07-11'),
    end_time:         '2:30 PM',
    registration_url: '',
    is_past:          true,
    is_pinned:        false,
    is_active:        true,
    lms_course_slug:  null,

    page_blocks: {
      registrations_open: false,

      section_visibility: {
        hero:               true,
        story:              true,
        output:             true,
        workshops:          true,
        pricing:            false,
        mentors:            true,
        video_gallery:      false,
        text_testimonials:  false,
        video_testimonials: false,
        faqs:               true,
        contact:            true,
      },

      hero: {
        top_badge:   'Past Event · July 2026',
        headline:    'The StartUp Legal Playbook',
        subheadline: 'Term Sheets, Co-Founder Agreements & Startup Legal Pitfalls',
        description: 'A founder-focused masterclass covering the agreements that shape a founder\'s journey — from co-founder discussions to fundraising conversations.',
        key_highlights: [
          '📅 Saturday, 11 July 2026',
          '🕚 11:30 AM – 2:30 PM',
          '📍 Spotlight SP, Solitaire Corporate Park, Mumbai',
          '⚖️ Khushboo Agrawal (Ex-Trilegal, NALSAR)',
          '🚀 Gaurav Bansal (Founder, SETU)',
          '🎁 Bonus: Term Sheet Cheat Sheet for all attendees',
        ],
      },

      story: {
        visible:     true,
        headline:    'Startups Don\'t Collapse Because of Bad Ideas. They Collapse Because of Bad Agreements.',
        description: 'What happens to your co-founder\'s equity if they leave? What looks like a great term sheet can still leave founders with almost nothing on a ₹50 Cr exit because of clauses like liquidation preference.',
        boxes: [
          {
            title:       'The Unprepared Founder',
            description: 'Signs boilerplate agreements without understanding the long-term impact on ownership and control.',
            bullets: [
              { text: 'Splits equity 50/50 on day one without vesting schedules or cliff periods', style: 'cross' },
              { text: 'Doesn\'t know what happens to founder equity or IP if a co-founder leaves', style: 'cross' },
              { text: 'Blindly accepts liquidation preferences (1x/2x participating) and loses exit value', style: 'cross' },
              { text: 'Unaware of anti-dilution traps and aggressive investor board control clauses', style: 'cross' },
              { text: 'Relies solely on raw AI drafts without understanding hidden legal liabilities', style: 'cross' },
            ],
          },
          {
            title:       'The Legally Empowered Founder',
            description: 'Protects their equity, secures investor deals with confidence, and avoids costly disputes.',
            bullets: [
              { text: 'Structures iron-clad Co-Founder Agreements with clear reverse vesting & IP assignment', style: 'check' },
              { text: 'Has documented exit mechanisms, deadlock resolution & buyback provisions', style: 'check' },
              { text: 'Decodes term sheets like a pro — spots aggressive clauses before signing', style: 'check' },
              { text: 'Understands pre vs post-money valuation, ESOP dilution & board dynamics', style: 'check' },
              { text: 'Knows exactly when to use AI for drafting and when to consult a specialist lawyer', style: 'check' },
            ],
          },
        ],
      },

      output: {
        image_url: '',
        headline: 'What You Take Home & Bonus Takeaways',
        bullets: [
          '<strong>Co-Founder Agreement Architecture:</strong> Master equity splits, 4-year vesting with 1-year cliff, IP assignment to company, and non-compete clauses.',
          '<strong>Term Sheet Mastery:</strong> Decode liquidation preferences, anti-dilution provisions, information rights, affirmative votes, and board seat controls.',
          '<strong>Valuation & Dilution Traps:</strong> Understand pre-money vs post-money valuation mechanics, unallocated ESOP pool impact, and cap table hygiene.',
          '<strong>Common Legal Red Flags:</strong> Identify hidden clauses and negotiation traps that cost founders millions at exit.',
          '<strong>AI in Legal Drafting:</strong> Learn safe prompts and boundaries for AI legal drafting vs high-risk scenarios requiring a startup lawyer.',
          '<strong>🎁 Bonus Takeaway:</strong> Exclusive Term Sheet Cheat Sheet covering key clauses, terms, and red flags before negotiating.',
          '<strong>Founder Network:</strong> Direct connections with fellow builders, founders, and the SETU Startup School community.',
        ],
      },

      workshops: [
        {
          id: 'slp-session-1',
          priority_order: 1,
          visible: true,
          icon: 'file-signature',
          badge: 'Session 1',
          color: '#8B5CF6',
          heading: '11:30 AM – 12:00 PM',
          title: 'Foundations of Startup Agreements',
          mentor: 'Khushboo Agrawal & Gaurav Bansal',
          duration: '30 Mins',
          key_features: '<p>Co-Founder Agreements · Equity Structure · Vesting Schedules · IP Assignment</p>',
          pricing: {
            mode: 'offline',
            address: 'Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093',
            actual_price: 0,
            strike_price: 0,
            date_time_bullets: ['Saturday, 11 July 2026', '11:30 AM – 12:00 PM', 'In-person · Spotlight SP, Mumbai'],
          },
          cta: { text: 'Event Concluded', active: false },
          detail_bullets: {
            what_youll_learn: '<ul><li>What a Co-Founder Agreement must cover and why handshake deals fail</li><li>Structuring equity splits, 4-year reverse vesting, and 1-year cliff schedules</li><li>Intellectual Property (IP) assignment to the corporate entity from Day 0</li><li>What happens to equity when a co-founder leaves (good leaver vs bad leaver clauses)</li></ul>',
            your_deliverables: '<ul><li>Co-Founder Agreement essentials checklist</li><li>Founder equity vesting model & cliff guideline</li><li>IP assignment framework</li></ul>',
          },
        },
        {
          id: 'slp-session-2',
          priority_order: 2,
          visible: true,
          icon: 'handshake',
          badge: 'Session 2',
          color: '#D946EF',
          heading: '12:00 PM – 12:30 PM',
          title: 'Decoding Co-Founder Agreements & Dispute Resolution',
          mentor: 'Khushboo Agrawal',
          duration: '30 Mins',
          key_features: '<p>Roles & Responsibilities · Decision Deadlocks · Non-Compete & Non-Solicitation · Founder Exits</p>',
          pricing: {
            mode: 'offline',
            address: 'Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093',
            actual_price: 0,
            strike_price: 0,
            date_time_bullets: ['Saturday, 11 July 2026', '12:00 PM – 12:30 PM', 'In-person · Spotlight SP, Mumbai'],
          },
          cta: { text: 'Event Concluded', active: false },
          detail_bullets: {
            what_youll_learn: '<ul><li>Resolving 50/50 equity deadlocks and decision-making rights</li><li>Non-compete, non-solicitation, and confidentiality frameworks for founders</li><li>Protecting founder sweat equity vs incoming capital</li><li>Exit mechanisms, share buyback rights, and transfer restrictions</li></ul>',
            your_deliverables: '<ul><li>Deadlock resolution protocols template</li><li>Founder exit & share repurchase framework</li></ul>',
          },
        },
        {
          id: 'slp-session-3',
          priority_order: 3,
          visible: true,
          icon: 'comments',
          badge: 'Session 3',
          color: '#8B5CF6',
          heading: '12:30 PM – 1:00 PM',
          title: 'Open Q&A — Founder Legal Dilemmas',
          mentor: 'Khushboo Agrawal & Gaurav Bansal',
          duration: '30 Mins',
          key_features: '<p>Live Interactive Q&A · Real-World Founder Disputes · AI Drafting Risks</p>',
          pricing: {
            mode: 'offline',
            address: 'Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093',
            actual_price: 0,
            strike_price: 0,
            date_time_bullets: ['Saturday, 11 July 2026', '12:30 PM – 1:00 PM', 'In-person · Spotlight SP, Mumbai'],
          },
          cta: { text: 'Event Concluded', active: false },
          detail_bullets: {
            what_youll_learn: '<ul><li>Open floor for participant founders to discuss real legal dilemmas</li><li>Case studies on founder disputes and how they were resolved</li><li>When AI tools (ChatGPT, Claude) can assist drafting and where they introduce fatal errors</li><li>How to find, vet, and engage the right startup lawyer without overpaying</li></ul>',
            your_deliverables: '<ul><li>Live answers to your specific startup legal queries</li><li>Practical AI legal drafting guidelines and risk checklist</li></ul>',
          },
        },
        {
          id: 'slp-session-4',
          priority_order: 4,
          visible: true,
          icon: 'file-contract',
          badge: 'Session 4 · Core Masterclass',
          color: '#D946EF',
          heading: '1:00 PM – 1:30 PM',
          title: 'Decoding Term Sheets & Fundraising Clauses',
          mentor: 'Khushboo Agrawal & Gaurav Bansal',
          duration: '30 Mins',
          key_features: '<p>Term Sheets · Liquidation Preference · Anti-Dilution · Board Seats · ESOP Pool Impact</p>',
          pricing: {
            mode: 'offline',
            address: 'Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093',
            actual_price: 0,
            strike_price: 0,
            date_time_bullets: ['Saturday, 11 July 2026', '1:00 PM – 1:30 PM', 'In-person · Spotlight SP, Mumbai'],
          },
          cta: { text: 'Event Concluded', active: false },
          detail_bullets: {
            what_youll_learn: '<ul><li>Key Term Sheet clauses that affect founder control, equity, and future dilution</li><li>How 1x vs 2x Participating Liquidation Preference can leave founders with ₹0 on a ₹50 Cr exit</li><li>Broad-based Weighted Average vs Full Ratchet anti-dilution provisions</li><li>Information rights, affirmative voting matters, drag-along & tag-along rights</li><li>Pre-money vs Post-money valuation trap and unallocated ESOP pool creation</li></ul>',
            your_deliverables: '<ul><li>🎁 Bonus: Term Sheet Cheat Sheet for all attendees</li><li>Term Sheet clause red flags reference matrix</li><li>Pre vs Post money valuation & dilution cheat sheet</li></ul>',
          },
        },
        {
          id: 'slp-session-5',
          priority_order: 5,
          visible: true,
          icon: 'users',
          badge: 'Session 5 · Networking',
          color: '#8B5CF6',
          heading: '1:30 PM – 2:30 PM',
          title: 'Founder Introductions & Peer Networking',
          mentor: 'SETU – The Startup School',
          duration: '60 Mins',
          key_features: '<p>Curated Networking · Co-Founder Discovery · Ecosystem Connections</p>',
          pricing: {
            mode: 'offline',
            address: 'Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093',
            actual_price: 0,
            strike_price: 0,
            date_time_bullets: ['Saturday, 11 July 2026', '1:30 PM – 2:30 PM', 'In-person · Spotlight SP, Mumbai'],
          },
          cta: { text: 'Event Concluded', active: false },
          detail_bullets: {
            what_youll_learn: '<ul><li>Pitch your startup or idea in a supportive, builder-first environment</li><li>Connect with potential co-founders, collaborators, and early advisors</li><li>Exchange learnings and war stories with fellow early-stage founders in Mumbai</li></ul>',
            your_deliverables: '<ul><li>Direct access to the SETU Startup School community</li><li>High-trust peer network of founders at the same stage</li></ul>',
          },
        },
      ],

      mentors: {
        section_headline: 'Meet Your Speakers',
        items: [
          {
            id: 'mentor-khushboo-slp',
            name: 'Khushboo Agrawal',
            badge_text: 'Startup Lawyer',
            professional_headline: 'Startup Lawyer | Ex-Trilegal | NALSAR Graduate',
            professional_description: 'Advised leading startups including Swiggy, Shiprocket, and 1% Club on fundraising, term sheets, commercial contracts, and strategic transactions. She specializes in helping founders navigate critical legal decisions without the jargon.',
            credential_bullets: [
              'Ex-Trilegal & NALSAR University of Law Graduate',
              'Advised Swiggy, Shiprocket, 1% Club & leading ventures',
              'Expert in Term Sheets, Founder Agreements & Venture Capital transactions',
              'Focuses on jargon-free, founder-friendly legal execution',
            ],
            image_url: '',
            visible: true,
            color: '#8B5CF6',
          },
          {
            id: 'mentor-gaurav-slp',
            name: 'Gaurav Bansal',
            badge_text: 'Founder & Ecosystem Builder',
            professional_headline: 'Founder, SETU – The Startup School | Startup Mentor',
            professional_description: '15+ years of experience across startups, e-commerce, banking, and edtech. Ex-Mentor at IIT Delhi, IIT Madras, and IIM Rohtak, with extensive experience in startup growth, strategic partnerships, and founder advisory.',
            credential_bullets: [
              'Founder, SETU – The Startup School',
              'Former Startup Mentor — IIT Delhi (DMS), IIT Madras, IIM Rohtak & Wadhwani Foundation',
              '2X Entrepreneur with 15+ years experience (Just Dial, HDFC Bank, Idea Cellular)',
              'Advised 100+ early-stage founders on fundraising, legal setup and scaling',
            ],
            image_url: '',
            visible: true,
            color: '#D946EF',
          },
        ],
      },

      faqs: [
        {
          id: 'faq-1',
          question: 'What is The StartUp Legal Playbook?',
          answer: 'The StartUp Legal Playbook is an interactive, founder-focused masterclass designed to demystify startup legal essentials — including co-founder agreements, term sheets, dilution, and common legal pitfalls — without confusing legal jargon. Hosted by SETU – The Startup School with Venue Partner Spotlight SP in Mumbai.',
          visible: true,
          priority_order: 1,
        },
        {
          id: 'faq-2',
          question: 'What key topics are covered in the session?',
          answer: 'Key topics include: 1) Structuring and evaluating Co-Founder Agreements (equity splits, vesting cliffs, IP assignment, founder exit clauses), 2) Key Term Sheet clauses that affect control and dilution (Liquidation preference, anti-dilution, board rights), 3) Common legal mistakes and red flags founders make, 4) When AI helps with drafting vs when it creates fatal risk, and 5) Founder introductions and peer networking.',
          visible: true,
          priority_order: 2,
        },
        {
          id: 'faq-3',
          question: 'What is the Bonus Takeaway for attendees?',
          answer: 'All attendees receive an exclusive Term Sheet Cheat Sheet covering key clauses, terms, and red flags founders should know before signing or negotiating with angel investors and VCs.',
          visible: true,
          priority_order: 3,
        },
        {
          id: 'faq-4',
          question: 'Who should attend this masterclass?',
          answer: 'This masterclass is designed for Startup Founders, Co-Founders, Early-Stage Teams, Student Entrepreneurs, and anyone planning to raise angel or venture capital.',
          visible: true,
          priority_order: 4,
        },
        {
          id: 'faq-5',
          question: 'Where is the venue located?',
          answer: 'The event takes place at Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093.',
          visible: true,
          priority_order: 5,
        },
        {
          id: 'faq-6',
          question: 'Do I need a legal background to attend?',
          answer: 'Not at all. The session is specifically structured for non-lawyer founders, operators, and builders to understand the business and ownership implications of legal documents in plain English.',
          visible: true,
          priority_order: 6,
        },
        {
          id: 'faq-7',
          question: 'How do I reach out for questions or future events?',
          answer: 'You can email our events team at events.tss2025@gmail.com or join the SETU The Startup School WhatsApp community.',
          visible: true,
          priority_order: 7,
        },
      ],

      contact: {
        whatsapp: {
          headline: 'Join Our Founder Community',
          description: 'Connect with fellow founders, get legal & startup insights, and stay updated on upcoming masterclasses by SETU – The Startup School.',
          button_text: 'Join WhatsApp Community',
          link: 'https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t',
          enabled: true,
        },
        lead_gen: {
          headline: 'Stay Updated for Future Masterclasses',
          subtext: 'Drop your details to receive invitations for upcoming founder masterclasses in Mumbai & Delhi NCR.',
          submit_text: 'Request Callback',
          description: 'Email: events.tss2025@gmail.com | Website: setustartupschool.com',
          admin_email: 'events.tss2025@gmail.com',
          lead_source_tag: 'The Startup Legal Playbook - 11 Jul Event Page',
        },
        lead_form: {
          headline: 'Stay Updated',
          subtext: 'Register your interest for our next legal masterclass.',
          submit_text: 'Notify Me',
          destination_email: 'events.tss2025@gmail.com',
          destination_contact_number: '9953301113',
        },
      },

      coupon:  { code: '', discount_percent: 0, active: false },
      extras: {
        workshop_nudges: { enabled: false, frequency_sections: 3 },
        footer:          '© 2026 SETU – The Startup School. All rights reserved.',
        chatbot:         { enabled: false, note: '' },
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT 4 — Fundraising Essentials: 5Hr Masterclass at Delhi NCR (2 Aug 2026)
  // Source: Luma event page (screenshots provided 2026-09-12)
  // Venue: The Hosteller, Mathura Rd, near Ashram Chowk, New Delhi
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title:            'Fundraising Essentials – 5Hr Masterclass at Delhi NCR',
    description:      'What Every Founder Should Know Before Meeting Investors. An Intensive Offline Masterclass by Setu Startup School.',
    slug:             'fundraising-essentials-delhi-2aug',
    banner_url:       '',
    venue:            'The Hosteller, Mathura Rd, near Ashram Chowk',
    city:             'New Delhi',
    start_date:       new Date('2026-08-02'),
    start_time:       '10:30 AM',
    end_date:         new Date('2026-08-02'),
    end_time:         '5:00 PM',
    registration_url: 'https://tss-tr.vercel.app/url/62eda2c2',
    is_past:          true,
    is_pinned:        false,
    is_active:        true,
    lms_course_slug:  null,

    page_blocks: {
      registrations_open: false,

      section_visibility: {
        hero:               true,
        story:              true,
        output:             true,
        workshops:          true,
        pricing:            true,
        mentors:            true,
        video_gallery:      false,
        text_testimonials:  false,
        video_testimonials: false,
        faqs:               true,
        contact:            true,
      },

      hero: {
        top_badge:   'Past Event · August 2026',
        headline:    'Fundraising Essentials',
        subheadline: 'What Every Founder Should Know Before Meeting Investors',
        description: 'Do you think fundraising is just about building a great pitch deck? This intensive 5-hour offline masterclass will change how you think about raising capital — from investor targeting to term sheets, due diligence, and beyond.',
        key_highlights: [
          '5-hour intensive offline masterclass',
          'Live Mock Pitch Session with real feedback',
          'Critical financial terms & agreements decoded',
          'Investor database & funding stage overview',
          'Data Room preparation walkthrough',
          '96 founders already trained',
        ],
      },

      story: {
        visible:     true,
        headline:    'Do You Know What Investors Really Look For?',
        description: 'Which investor is the right fit for your startup? Who within a VC firm should you actually approach? How do ESOPs impact your ownership? What happens after a Term Sheet is signed? Why do many startups fail during due diligence — even after receiving investor interest?',
        boxes: [
          {
            title:       'The Unprepared Founder',
            description: 'Goes into investor meetings with passion but no structure.',
            bullets: [
              { text: 'Doesn\'t know which investor type fits their stage',          style: 'cross' },
              { text: 'Stumbles on due diligence — loses deal after term sheet',    style: 'cross' },
              { text: 'Unaware how ESOPs and cap table dilution work',              style: 'cross' },
            ],
          },
          {
            title:       'The Masterclass Graduate',
            description: 'Walks in confident, speaks the investor\'s language.',
            bullets: [
              { text: 'Maps the right investor type to their funding stage',        style: 'check' },
              { text: 'Prepares a data room that passes due diligence with ease',   style: 'check' },
              { text: 'Negotiates from knowledge — not desperation',                style: 'check' },
            ],
          },
        ],
      },

      output: {
        image_url: '',
        headline: {
          text:  'What You\'ll Take Home',
          color: '#7C3AED',
        },
        bullets: [
          'Critical Financial Terms and Agreements every founder must know',
          'Basics of Key Agreements and Term Sheet',
          'Understanding Due Diligence — why startups lose deals post term sheet',
          'Investor Types and Funding Stages overview',
          'Who\'s who in a VC fund and how to approach them',
          'Data Room Preparation checklist',
          'Pitch Deck structure and discussion framework',
          'Live feedback from Mock Pitch session',
        ],
      },

      workshops: [
        {
          id:             'fe-session-1',
          priority_order: 1,
          heading:        '10:30 AM – 11:00 AM',
          title:          'Introductions & Networking',
          key_features:   'Networking · Icebreakers · Setting the stage',
          detail_bullets: {
            items: [
              'Meet fellow founders from the Delhi NCR ecosystem',
              'Quick founder introductions and startup spotlights',
              'Session overview and what to expect',
            ],
          },
        },
        {
          id:             'fe-session-2',
          priority_order: 2,
          heading:        '11:00 AM – 2:30 PM',
          title:          'Fundraising Essentials Masterclass',
          key_features:   'Term sheets · Cap table · Due diligence · Investor types · VC fund structure',
          detail_bullets: {
            items: [
              'Critical Financial Terms and Agreements one must know',
              'Basics of Key Agreements and Term Sheet clauses',
              'What is Due Diligence and why startups lose cheques after term sheet signing',
              'Investor Types and Funding Stages — Seed, Series A, B, and beyond',
              'Who\'s who in a VC fund and how to approach the right person',
              'Data Room preparation — what goes in and why',
              'Pitch Decks: structure, storytelling, and common mistakes',
            ],
          },
        },
        {
          id:             'fe-session-3',
          priority_order: 3,
          heading:        '2:30 PM – 3:15 PM',
          title:          'Break',
          key_features:   'Food packets provided · Networking · Informal discussions',
          detail_bullets: {
            items: [
              'Food packets provided for all attendees',
              'Informal networking with fellow founders',
              'Time to prepare questions for the Q&A session',
            ],
          },
        },
        {
          id:             'fe-session-4',
          priority_order: 4,
          heading:        '3:15 PM – 4:00 PM',
          title:          'Live Mock Pitch Session',
          key_features:   'Live pitches · Investor feedback · 3 shortlisted startups',
          detail_bullets: {
            items: [
              'Three shortlisted startups pitch live to the room',
              'Real-time feedback from Gaurav Bansal',
              'Audience learns from each pitch critique',
              'Founders encouraged to submit pitch decks before the event for shortlisting',
            ],
          },
        },
        {
          id:             'fe-session-5',
          priority_order: 5,
          heading:        '4:00 PM – 5:00 PM',
          title:          'Open Q&A and Networking',
          key_features:   'Open Q&A · Networking · Wrap-up',
          detail_bullets: {
            items: [
              'Open floor — ask anything about fundraising, term sheets, or investor relations',
              'Peer-to-peer networking with founders from Delhi NCR',
              'Closing insights and next steps from the host',
            ],
          },
        },
      ],

      pricing_options: [
        {
          id:             'fe-ticket-standard',
          priority_order: 1,
          heading:        'Masterclass Ticket',
          title:          'Fundraising Essentials — Full Day Access',
          key_features:   '5-hour masterclass · Mock Pitch · Networking · Food break included',
          pricing: {
            strike_price:       599,
            actual_price:       449,
            date_time_bullets:  ['Sunday, 2 August 2026', '10:30 AM – 5:00 PM', 'In-person · The Hosteller, Delhi NCR'],
            mode:               'offline',
            address:            'The Hosteller, Mathura Rd, near Ashram Chowk, New Delhi',
          },
          cta:     { text: 'Registration Closed', active: false },
          visible: true,
        },
      ],

      mentors: {
        headline: 'Your Mentor',
        items: [
          {
            id:                       'mentor-gaurav-bansal',
            image_url:                '',
            name:                     'Gaurav Bansal',
            professional_headline:    'Founder, Setu Startup School | 2X Entrepreneur',
            professional_description: 'Gaurav is a 2X entrepreneur and the founder of Setu Startup School. He has mentored hundreds of founders across IIT Delhi, IIT Madras, and IIM Rohtak, helping them navigate fundraising, investor relations, and company building.',
            credential_bullets: [
              'Founder, Setu Startup School',
              'Startup Mentor — IIT Delhi (DMS)',
              'Startup Mentor — IIT Madras & IIM Rohtak',
              '2X Entrepreneur',
            ],
            visible:       true,
            color:         '#7C3AED',
            imagePosition: 'center',
            badge_text:    'Lead Mentor',
          },
        ],
      },

      faqs: [
        {
          question: 'What is the detailed event flow?',
          answer:   '10:30 AM – 11:00 AM: Introductions & Networking\n11:00 AM – 2:30 PM: Fundraising Essentials Masterclass\n2:30 PM – 3:15 PM: Break (food packets provided)\n3:15 PM – 4:00 PM: Live Mock Pitch Session\n4:00 PM – 5:00 PM: Open Q&A and Networking',
        },
        {
          question: 'Where is the venue?',
          answer:   'The Hosteller, Mathura Rd, near Ashram Chowk, New Delhi. All interested applicants must fill in their details at: https://tss-tr.vercel.app/url/62eda2c2',
        },
        {
          question: 'What is the ticket price?',
          answer:   '₹449/- per person.',
        },
        {
          question: 'What will I learn at this masterclass?',
          answer:   'Critical Financial Terms and Agreements one must know · Basics of Key Agreements and Term Sheet · What is Due Diligence and why many startups don\'t receive a cheque even after term sheet signing · Investors Types and Funding Stages overview · Who\'s who in a VC fund and how to approach them · Data Room Preparation · Pitch Decks and Discussions.',
        },
        {
          question: 'What is the Mock Pitch Opportunity?',
          answer:   'Three shortlisted startups will be invited to present a live pitch and receive practical feedback from the mentor. Founders are encouraged to submit their pitch decks before the event for consideration.',
        },
        {
          question: 'What are the break timings?',
          answer:   'The break is from 2:30 PM to 3:15 PM. Food packets will be provided to all attendees during this time.',
        },
        {
          question: 'Will any food/snacks be provided?',
          answer:   'Yes! Food packets will be provided during the break from 2:30 PM to 3:15 PM.',
        },
        {
          question: 'How do I contact the organiser?',
          answer:   'Email: events.tss2025@gmail.com | Call: 8810461213',
        },
      ],

      contact: {
        whatsapp: {
          headline:     'Have Questions?',
          description:  'Reach out to us directly for any queries about the event.',
          button_text:  'Join WhatsApp Group',
          link:         'https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t',
        },
        lead_form: {
          headline:                   'Stay Updated',
          subtext:                    'Register your interest for our next masterclass in Delhi.',
          submit_text:                'Notify Me',
          destination_email:          'events.tss2025@gmail.com',
          destination_contact_number: '8810461213',
        },
      },

      coupon:  { code: '', discount_percent: 0, active: false },
      extras: {
        workshop_nudges: { enabled: false, frequency_sections: 3 },
        footer:          '© 2026 The Startup School. All rights reserved.',
        chatbot:         { enabled: false, note: '' },
      },
    },
  },
];

module.exports = { PAST_EVENTS };