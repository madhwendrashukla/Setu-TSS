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
    description:      'A founder-focused masterclass on term sheets, co-founder agreements, equity, dilution, and startup legal pitfalls.',
    slug:             'startup-legal-playbook-11jul',
    banner_url:       '',
    venue:            'Spotlight Strategic Partners, Solitaire Corporate Park, #Unit 1, Floor 3',
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
        faqs:               false,
        contact:            true,
      },

      hero: {
        top_badge:   'Past Event · July 2026',
        headline:    'The StartUp Legal Playbook',
        subheadline: 'Masterclass on Term Sheets, Co-Founder Agreements & Startup Legal Pitfalls',
        description: 'A founder-focused masterclass covering the agreements that shape a founder\'s journey — from co-founder discussions to fundraising conversations.',
        key_highlights: [
          'How to structure and evaluate a Co-Founder Agreement',
          'Key Term Sheet clauses that affect control, equity, and dilution',
          'Common legal mistakes and red flags founders should avoid',
          'When AI can help with drafting and when it can create risk',
          'Bonus: Term Sheet Cheat Sheet for all attendees',
        ],
      },

      story: {
        visible:     true,
        headline:    'What Looks Like a Great Deal Can Cost You Everything',
        description: 'What happens to your co-founder\'s equity if they leave? What looks like a great term sheet can still leave founders with almost nothing on a ₹50 Cr exit — because of clauses like liquidation preference.',
        boxes: [
          {
            title:       'The Uninformed Founder',
            description: 'Signs agreements without understanding the implications.',
            bullets: [
              { text: 'Doesn\'t know what happens to co-founder equity on exit',          style: 'cross' },
              { text: 'Misses liquidation preference clauses in term sheets',              style: 'cross' },
              { text: 'Relies on AI drafts without legal review — creates hidden risk',   style: 'cross' },
            ],
          },
          {
            title:       'The Legally Prepared Founder',
            description: 'Understands the fine print and protects their equity.',
            bullets: [
              { text: 'Structures co-founder agreements with vesting & IP clauses',       style: 'check' },
              { text: 'Reads term sheets with confidence — spots red flags instantly',    style: 'check' },
              { text: 'Knows when to use AI and when to get a real lawyer',               style: 'check' },
            ],
          },
        ],
      },

      output: {
        image_url: '',
        headline: {
          text:  'What You Take Home',
          color: '#7C3AED',
        },
        bullets: [
          'Understanding of Co-Founder Agreement structure',
          'Key Term Sheet clauses that affect your equity & control',
          'List of common legal red flags to watch out for',
          'Clarity on when AI drafting helps vs. creates risk',
          'Term Sheet Cheat Sheet (bonus for all attendees)',
        ],
      },

      workshops: [
        {
          id:             'slp-session-1',
          priority_order: 1,
          heading:        '11:30 AM – 12:00 PM',
          title:          'Foundations of Startup Agreements',
          key_features:   'Co-founder agreements · Equity structure · Vesting schedules · IP ownership',
          detail_bullets: {
            items: [
              'What a Co-Founder Agreement must cover',
              'Equity split and vesting cliff structures',
              'IP assignment and ownership clauses',
              'What happens when a co-founder leaves',
            ],
          },
        },
        {
          id:             'slp-session-2',
          priority_order: 2,
          heading:        '12:00 PM – 12:30 PM',
          title:          'Decoding Co-Founder Agreements',
          key_features:   'Term sheets · Liquidation preference · Anti-dilution · Control rights',
          detail_bullets: {
            items: [
              'Key Term Sheet clauses every founder must understand',
              'How liquidation preference can wipe out founder returns',
              'Anti-dilution provisions and their impact on your stake',
              'Board control and voting rights explained',
            ],
          },
        },
        {
          id:             'slp-session-3',
          priority_order: 3,
          heading:        '12:30 PM – 1:00 PM',
          title:          'Open Q&A',
          key_features:   'Live Q&A · Audience questions · Real-world scenarios',
          detail_bullets: {
            items: [
              'Open floor for founder questions',
              'Real-world legal scenarios and how to handle them',
              'When to use AI for legal drafting and when not to',
              'How to find the right startup lawyer',
            ],
          },
        },
      ],

      mentors: {
        headline: 'Your Speakers',
        items: [
          {
            name:         'Khushboo Agrawal',
            title:        'Startup Lawyer | Ex-Trilegal | NALSAR',
            bio:          'Khushboo is a startup lawyer with experience at Trilegal and a NALSAR graduate. She specialises in founder agreements, term sheets, and startup legal structuring.',
            photo_url:    '',
            linkedin_url: '',
          },
          {
            name:         'Gaurav Bansal',
            title:        'Founder, SETU | Ex-IIT/IIM Mentor',
            bio:          'Gaurav is the founder of SETU – The Startup School and an ex-IIT/IIM mentor who has guided hundreds of founders through fundraising and company building.',
            photo_url:    '',
            linkedin_url: '',
          },
        ],
      },

      contact: {
        whatsapp: {
          enabled: true,
          label:   'Join Our Community',
          link:    'https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t',
        },
        lead_form: {
          headline:                   'Stay Updated',
          subtext:                    'Register your interest for our next legal masterclass.',
          submit_text:                'Notify Me',
          destination_email:          'info@thestartupschool.in',
          destination_contact_number: '',
        },
      },
    },

    coupon:  { code: '', discount_percent: 0, active: false },
    extras: {
      workshop_nudges: { enabled: false, frequency_sections: 3 },
      footer:          '© 2026 The Startup School. All rights reserved.',
      chatbot:         { enabled: false, note: '' },
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