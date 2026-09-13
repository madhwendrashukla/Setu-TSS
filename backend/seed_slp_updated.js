const https = require("https");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTMwMDEwMn0.HWyzarLlDjWFLFy-ovsJxAZ8AoDNqHgyrUpd-c3EVa4";

function ul(items) {
  return "<ul>" + items.map(i => "<li>" + i + "</li>").join("") + "</ul>";
}

function kf(text) {
  return "<p>" + text + "</p>";
}

function putEvent(id, fields) {
  return new Promise((resolve, reject) => {
    const boundary = "----B" + Date.now();
    let body = "";
    for (const [k, v] of Object.entries(fields)) {
      body += "--" + boundary + "\r\n";
      body += "Content-Disposition: form-data; name=" + JSON.stringify(k) + "\r\n\r\n";
      body += v + "\r\n";
    }
    body += "--" + boundary + "--\r\n";
    const buf = Buffer.from(body, "utf8");
    const opts = {
      hostname: "foundersschool.in",
      port: 443,
      path: "/api/admin/events/" + id,
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + TOKEN,
        "Content-Type": "multipart/form-data; boundary=" + boundary,
        "Content-Length": buf.length,
      },
    };
    const req = https.request(opts, res => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, body: d }));
    });
    req.on("error", reject);
    req.write(buf);
    req.end();
  });
}

function getBySlug(slug) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: "foundersschool.in",
      port: 443,
      path: "/api/events/slug/" + slug,
      method: "GET",
      headers: { "Authorization": "Bearer " + TOKEN }
    };
    const req = https.request(opts, res => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        if (res.statusCode === 404) return resolve(null);
        try { resolve(JSON.parse(d)); } catch { resolve(null); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

const PAGE_BLOCKS = {
  registrations_open: false,
  section_visibility: {
    hero: true,
    story: true,
    output: true,
    workshops: true,
    pricing: false,
    mentors: true,
    video_gallery: false,
    text_testimonials: false,
    video_testimonials: false,
    faqs: true,
    contact: true,
  },

  hero: {
    top_badge: "Past Event · July 2026",
    headline: "The StartUp Legal Playbook",
    subheadline: "Term Sheets, Co-Founder Agreements & Startup Legal Pitfalls",
    description: "A founder-focused masterclass covering the agreements that shape a founder's journey — from co-founder discussions to fundraising conversations.",
    key_highlights: [
      "📅 Saturday, 11 July 2026",
      "🕚 11:30 AM – 2:30 PM",
      "📍 Spotlight SP, Solitaire Corporate Park, Mumbai",
      "⚖️ Khushboo Agrawal (Ex-Trilegal, NALSAR)",
      "🚀 Gaurav Bansal (Founder, SETU)",
      "🎁 Bonus: Term Sheet Cheat Sheet for all attendees",
    ],
  },

  story: {
    visible: true,
    headline: "Startups Don't Collapse Because of Bad Ideas. They Collapse Because of Bad Agreements.",
    description: "What happens to your co-founder's equity if they leave? What looks like a great term sheet can still leave founders with almost nothing on a ₹50 Cr exit because of clauses like liquidation preference.",
    boxes: [
      {
        title: "The Unprepared Founder",
        description: "Signs boilerplate agreements without understanding the long-term impact on ownership and control.",
        bullets: [
          { text: "Splits equity 50/50 on day one without vesting schedules or cliff periods", style: "cross" },
          { text: "Doesn't know what happens to founder equity or IP if a co-founder leaves", style: "cross" },
          { text: "Blindly accepts liquidation preferences (1x/2x participating) and loses exit value", style: "cross" },
          { text: "Unaware of anti-dilution traps and aggressive investor board control clauses", style: "cross" },
          { text: "Relies solely on raw AI drafts without understanding hidden legal liabilities", style: "cross" },
        ],
      },
      {
        title: "The Legally Empowered Founder",
        description: "Protects their equity, secures investor deals with confidence, and avoids costly disputes.",
        bullets: [
          { text: "Structures iron-clad Co-Founder Agreements with clear reverse vesting & IP assignment", style: "check" },
          { text: "Has documented exit mechanisms, deadlock resolution & buyback provisions", style: "check" },
          { text: "Decodes term sheets like a pro — spots aggressive clauses before signing", style: "check" },
          { text: "Understands pre vs post-money valuation, ESOP dilution & board dynamics", style: "check" },
          { text: "Knows exactly when to use AI for drafting and when to consult a specialist lawyer", style: "check" },
        ],
      },
    ],
  },

  output: {
    image_url: "",
    headline: "What You Take Home & Bonus Takeaways",
    bullets: [
      "<strong>Co-Founder Agreement Architecture:</strong> Master equity splits, 4-year vesting with 1-year cliff, IP assignment to company, and non-compete clauses.",
      "<strong>Term Sheet Mastery:</strong> Decode liquidation preferences, anti-dilution provisions, information rights, affirmative votes, and board seat controls.",
      "<strong>Valuation & Dilution Traps:</strong> Understand pre-money vs post-money valuation mechanics, unallocated ESOP pool impact, and cap table hygiene.",
      "<strong>Common Legal Red Flags:</strong> Identify hidden clauses and negotiation traps that cost founders millions at exit.",
      "<strong>AI in Legal Drafting:</strong> Learn safe prompts and boundaries for AI legal drafting vs high-risk scenarios requiring a startup lawyer.",
      "<strong>🎁 Bonus Takeaway:</strong> Exclusive Term Sheet Cheat Sheet covering key clauses, terms, and red flags before negotiating.",
      "<strong>Founder Network:</strong> Direct connections with fellow builders, founders, and the SETU Startup School community.",
    ],
  },

  workshops: [
    {
      id: "slp-session-1",
      priority_order: 1,
      visible: true,
      icon: "file-signature",
      badge: "Session 1",
      color: "#8B5CF6",
      heading: "11:30 AM – 12:00 PM",
      title: "Foundations of Startup Agreements",
      mentor: "Khushboo Agrawal & Gaurav Bansal",
      duration: "30 Mins",
      key_features: kf("Co-Founder Agreements · Equity Structure · Vesting Schedules · IP Assignment"),
      pricing: {
        mode: "offline",
        address: "Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093",
        actual_price: 0,
        strike_price: 0,
        date_time_bullets: [
          "Saturday, 11 July 2026",
          "11:30 AM – 12:00 PM",
          "In-person · Spotlight SP, Mumbai",
        ],
      },
      cta: { text: "Event Concluded", active: false },
      detail_bullets: {
        what_youll_learn: ul([
          "What a Co-Founder Agreement must cover and why handshake deals fail",
          "Structuring equity splits, 4-year reverse vesting, and 1-year cliff schedules",
          "Intellectual Property (IP) assignment to the corporate entity from Day 0",
          "What happens to equity when a co-founder leaves (good leaver vs bad leaver clauses)",
        ]),
        your_deliverables: ul([
          "Co-Founder Agreement essentials checklist",
          "Founder equity vesting model & cliff guideline",
          "IP assignment framework",
        ]),
      },
    },
    {
      id: "slp-session-2",
      priority_order: 2,
      visible: true,
      icon: "handshake",
      badge: "Session 2",
      color: "#D946EF",
      heading: "12:00 PM – 12:30 PM",
      title: "Decoding Co-Founder Agreements & Dispute Resolution",
      mentor: "Khushboo Agrawal",
      duration: "30 Mins",
      key_features: kf("Roles & Responsibilities · Decision Deadlocks · Non-Compete & Non-Solicitation · Founder Exits"),
      pricing: {
        mode: "offline",
        address: "Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093",
        actual_price: 0,
        strike_price: 0,
        date_time_bullets: [
          "Saturday, 11 July 2026",
          "12:00 PM – 12:30 PM",
          "In-person · Spotlight SP, Mumbai",
        ],
      },
      cta: { text: "Event Concluded", active: false },
      detail_bullets: {
        what_youll_learn: ul([
          "Resolving 50/50 equity deadlocks and decision-making rights",
          "Non-compete, non-solicitation, and confidentiality frameworks for founders",
          "Protecting founder sweat equity vs incoming capital",
          "Exit mechanisms, share buyback rights, and transfer restrictions",
        ]),
        your_deliverables: ul([
          "Deadlock resolution protocols template",
          "Founder exit & share repurchase framework",
        ]),
      },
    },
    {
      id: "slp-session-3",
      priority_order: 3,
      visible: true,
      icon: "comments",
      badge: "Session 3",
      color: "#8B5CF6",
      heading: "12:30 PM – 1:00 PM",
      title: "Open Q&A — Founder Legal Dilemmas",
      mentor: "Khushboo Agrawal & Gaurav Bansal",
      duration: "30 Mins",
      key_features: kf("Live Interactive Q&A · Real-World Founder Disputes · AI Drafting Risks"),
      pricing: {
        mode: "offline",
        address: "Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093",
        actual_price: 0,
        strike_price: 0,
        date_time_bullets: [
          "Saturday, 11 July 2026",
          "12:30 PM – 1:00 PM",
          "In-person · Spotlight SP, Mumbai",
        ],
      },
      cta: { text: "Event Concluded", active: false },
      detail_bullets: {
        what_youll_learn: ul([
          "Open floor for participant founders to discuss real legal dilemmas",
          "Case studies on founder disputes and how they were resolved",
          "When AI tools (ChatGPT, Claude) can assist drafting and where they introduce fatal errors",
          "How to find, vet, and engage the right startup lawyer without overpaying",
        ]),
        your_deliverables: ul([
          "Live answers to your specific startup legal queries",
          "Practical AI legal drafting guidelines and risk checklist",
        ]),
      },
    },
    {
      id: "slp-session-4",
      priority_order: 4,
      visible: true,
      icon: "file-contract",
      badge: "Session 4 · Core Masterclass",
      color: "#D946EF",
      heading: "1:00 PM – 1:30 PM",
      title: "Decoding Term Sheets & Fundraising Clauses",
      mentor: "Khushboo Agrawal & Gaurav Bansal",
      duration: "30 Mins",
      key_features: kf("Term Sheets · Liquidation Preference · Anti-Dilution · Board Seats · ESOP Pool Impact"),
      pricing: {
        mode: "offline",
        address: "Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093",
        actual_price: 0,
        strike_price: 0,
        date_time_bullets: [
          "Saturday, 11 July 2026",
          "1:00 PM – 1:30 PM",
          "In-person · Spotlight SP, Mumbai",
        ],
      },
      cta: { text: "Event Concluded", active: false },
      detail_bullets: {
        what_youll_learn: ul([
          "Key Term Sheet clauses that affect founder control, equity, and future dilution",
          "How 1x vs 2x Participating Liquidation Preference can leave founders with ₹0 on a ₹50 Cr exit",
          "Broad-based Weighted Average vs Full Ratchet anti-dilution provisions",
          "Information rights, affirmative voting matters, drag-along & tag-along rights",
          "Pre-money vs Post-money valuation trap and unallocated ESOP pool creation",
        ]),
        your_deliverables: ul([
          "🎁 Bonus: Term Sheet Cheat Sheet for all attendees",
          "Term Sheet clause red flags reference matrix",
          "Pre vs Post money valuation & dilution cheat sheet",
        ]),
      },
    },
    {
      id: "slp-session-5",
      priority_order: 5,
      visible: true,
      icon: "users",
      badge: "Session 5 · Networking",
      color: "#8B5CF6",
      heading: "1:30 PM – 2:30 PM",
      title: "Founder Introductions & Peer Networking",
      mentor: "SETU – The Startup School",
      duration: "60 Mins",
      key_features: kf("Curated Networking · Co-Founder Discovery · Ecosystem Connections"),
      pricing: {
        mode: "offline",
        address: "Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093",
        actual_price: 0,
        strike_price: 0,
        date_time_bullets: [
          "Saturday, 11 July 2026",
          "1:30 PM – 2:30 PM",
          "In-person · Spotlight SP, Mumbai",
        ],
      },
      cta: { text: "Event Concluded", active: false },
      detail_bullets: {
        what_youll_learn: ul([
          "Pitch your startup or idea in a supportive, builder-first environment",
          "Connect with potential co-founders, collaborators, and early advisors",
          "Exchange learnings and war stories with fellow early-stage founders in Mumbai",
        ]),
        your_deliverables: ul([
          "Direct access to the SETU Startup School community",
          "High-trust peer network of founders at the same stage",
        ]),
      },
    },
  ],

  mentors: {
    section_headline: "Meet Your Speakers",
    items: [
      {
        id: "mentor-khushboo-slp",
        name: "Khushboo Agrawal",
        badge_text: "Startup Lawyer",
        professional_headline: "Startup Lawyer | Ex-Trilegal | NALSAR Graduate",
        professional_description: "Advised leading startups including Swiggy, Shiprocket, and 1% Club on fundraising, term sheets, commercial contracts, and strategic transactions. She specializes in helping founders navigate critical legal decisions without the jargon.",
        credential_bullets: [
          "Ex-Trilegal & NALSAR University of Law Graduate",
          "Advised Swiggy, Shiprocket, 1% Club & leading ventures",
          "Expert in Term Sheets, Founder Agreements & Venture Capital transactions",
          "Focuses on jargon-free, founder-friendly legal execution",
        ],
        image_url: "",
        visible: true,
        color: "#8B5CF6",
      },
      {
        id: "mentor-gaurav-slp",
        name: "Gaurav Bansal",
        badge_text: "Founder & Ecosystem Builder",
        professional_headline: "Founder, SETU – The Startup School | Startup Mentor",
        professional_description: "15+ years of experience across startups, e-commerce, banking, and edtech. Ex-Mentor at IIT Delhi, IIT Madras, and IIM Rohtak, with extensive experience in startup growth, strategic partnerships, and founder advisory.",
        credential_bullets: [
          "Founder, SETU – The Startup School",
          "Former Startup Mentor — IIT Delhi (DMS), IIT Madras, IIM Rohtak & Wadhwani Foundation",
          "2X Entrepreneur with 15+ years experience (Just Dial, HDFC Bank, Idea Cellular)",
          "Advised 100+ early-stage founders on fundraising, legal setup and scaling",
        ],
        image_url: "",
        visible: true,
        color: "#D946EF",
      },
    ],
  },

  faqs: [
    {
      id: "faq-1",
      question: "What is The StartUp Legal Playbook?",
      answer: "The StartUp Legal Playbook is an interactive, founder-focused masterclass designed to demystify startup legal essentials — including co-founder agreements, term sheets, dilution, and common legal pitfalls — without confusing legal jargon. Hosted by SETU – The Startup School with Venue Partner Spotlight SP in Mumbai.",
      visible: true,
      priority_order: 1,
    },
    {
      id: "faq-2",
      question: "What key topics are covered in the session?",
      answer: "Key topics include: 1) Structuring and evaluating Co-Founder Agreements (equity splits, vesting cliffs, IP assignment, founder exit clauses), 2) Key Term Sheet clauses that affect control and dilution (Liquidation preference, anti-dilution, board rights), 3) Common legal mistakes and red flags founders make, 4) When AI helps with drafting vs when it creates fatal risk, and 5) Founder introductions and peer networking.",
      visible: true,
      priority_order: 2,
    },
    {
      id: "faq-3",
      question: "What is the Bonus Takeaway for attendees?",
      answer: "All attendees receive an exclusive Term Sheet Cheat Sheet covering key clauses, terms, and red flags founders should know before signing or negotiating with angel investors and VCs.",
      visible: true,
      priority_order: 3,
    },
    {
      id: "faq-4",
      question: "Who should attend this masterclass?",
      answer: "This masterclass is designed for Startup Founders, Co-Founders, Early-Stage Teams, Student Entrepreneurs, and anyone planning to raise angel or venture capital.",
      visible: true,
      priority_order: 4,
    },
    {
      id: "faq-5",
      question: "Where is the venue located?",
      answer: "The event takes place at Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East, Mumbai, MH 400093.",
      visible: true,
      priority_order: 5,
    },
    {
      id: "faq-6",
      question: "Do I need a legal background to attend?",
      answer: "Not at all. The session is specifically structured for non-lawyer founders, operators, and builders to understand the business and ownership implications of legal documents in plain English.",
      visible: true,
      priority_order: 6,
    },
    {
      id: "faq-7",
      question: "How do I reach out for questions or future events?",
      answer: "You can email our events team at events.tss2025@gmail.com or join the SETU The Startup School WhatsApp community.",
      visible: true,
      priority_order: 7,
    },
  ],

  contact: {
    whatsapp: {
      headline: "Join Our Founder Community",
      description: "Connect with fellow founders, get legal & startup insights, and stay updated on upcoming masterclasses by SETU – The Startup School.",
      button_text: "Join WhatsApp Community",
      link: "https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t",
      enabled: true,
    },
    lead_gen: {
      headline: "Stay Updated for Future Masterclasses",
      subtext: "Drop your details to receive invitations for upcoming founder masterclasses in Mumbai & Delhi NCR.",
      submit_text: "Request Callback",
      description: "Email: events.tss2025@gmail.com | Website: setustartupschool.com",
      admin_email: "events.tss2025@gmail.com",
      lead_source_tag: "The Startup Legal Playbook - 11 Jul Event Page",
    },
    lead_form: {
      headline: "Stay Updated",
      subtext: "Register your interest for our next legal masterclass.",
      submit_text: "Notify Me",
      destination_email: "events.tss2025@gmail.com",
      destination_contact_number: "9953301113",
    },
  },

  coupon: { code: "", discount_percent: 0, active: false },
  extras: {
    workshop_nudges: { enabled: false, frequency_sections: 3 },
    footer: "2026 SETU – The Startup School. All rights reserved.",
    chatbot: { enabled: false, note: "" },
  },
};

async function main() {
  const slug = "startup-legal-playbook-11jul";
  console.log("Checking existing event for slug:", slug);
  const existing = await getBySlug(slug);

  if (!existing) {
    console.error("Could not find event with slug:", slug);
    return;
  }

  console.log("Found event ID:", existing.id);
  console.log("Updating event on foundersschool.in via API...");

  const fields = {
    title: "The StartUp Legal Playbook",
    description: "A founder-focused masterclass on term sheets, co-founder agreements, equity, dilution, and startup legal pitfalls with Khushboo Agrawal and Gaurav Bansal.",
    slug: slug,
    venue: "Spotlight Strategic Partners, Unit 1, Floor 3, Building 2, Solitaire Corporate Park, Andheri East",
    city: "Mumbai",
    start_date: "2026-07-11",
    start_time: "11:30 AM",
    end_date: "2026-07-11",
    end_time: "2:30 PM",
    registration_url: "",
    is_past: "true",
    is_pinned: "false",
    is_active: "true",
    page_blocks: JSON.stringify(PAGE_BLOCKS),
  };

  const res = await putEvent(existing.id, fields);
  console.log("Response Status:", res.status);
  console.log("Response Body:", res.body.slice(0, 500));

  if (res.status === 200) {
    console.log("SUCCESS: Event updated and seeded cleanly!");
  } else {
    console.error("FAILED to update event.");
  }
}

main().catch(console.error);
