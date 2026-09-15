const https = require("https");
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTIxMjUwOH0.CYttfiMQMkxiq3rJ4pvx8m0pSsWaYvK_mwyeH_Yipng";

function ul(items) { return "<ul>" + items.map(i => "<li>" + i + "</li>").join("") + "</ul>"; }
function kf(t)     { return "<p>" + t + "</p>"; }

function postEvent(fields) {
  return new Promise((resolve, reject) => {
    const boundary = "----B" + Date.now();
    let body = "";
    for (const [k,v] of Object.entries(fields)) {
      body += "--" + boundary + "\r\n";
      body += "Content-Disposition: form-data; name=" + JSON.stringify(k) + "\r\n\r\n";
      body += v + "\r\n";
    }
    body += "--" + boundary + "--\r\n";
    const buf = Buffer.from(body, "utf8");
    const opts = {
      hostname: "foundersschool.in", port: 443,
      path: "/api/admin/events", method: "POST",
      headers: { "Authorization": "Bearer " + TOKEN, "Content-Type": "multipart/form-data; boundary=" + boundary, "Content-Length": buf.length },
    };
    const req = https.request(opts, res => {
      let d = ""; res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, body: d }));
    });
    req.on("error", reject);
    req.write(buf); req.end();
  });
}

function getBySlug(slug) {
  return new Promise((resolve, reject) => {
    const opts = { hostname:"foundersschool.in", port:443, path:"/api/events/slug/"+slug, method:"GET", headers:{"Authorization":"Bearer "+TOKEN} };
    const req = https.request(opts, res => { let d=""; res.on("data",c=>d+=c); res.on("end",()=>{ if(res.statusCode===404) return resolve(null); try{resolve(JSON.parse(d));}catch{resolve(null);} }); });
    req.on("error", reject); req.end();
  });
}

const PAGE_BLOCKS = {
  registrations_open: false,
  section_visibility: {
    hero: true, story: true, output: true, workshops: true,
    pricing: false, mentors: true,
    video_gallery: false, text_testimonials: false, video_testimonials: false,
    faqs: true, contact: true,
  },

  hero: {
    top_badge: "Past Event | August 2026",
    headline: "Chai and Conversation",
    subheadline: "With Startup Founders and Aspirants | Gurgaon",
    description: "Building a startup can be exciting, but it can also be lonely. Sometimes the best insights come from conversations with people who are walking the same path. An informal 3.5-hour meetup where founders, aspiring entrepreneurs, and startup enthusiasts come together to network, exchange experiences, and learn from one another.",
    key_highlights: [
      "Free entry - Limited seats (Google Form mandatory)",
      "Open Founder Discussion - challenges, lessons, real experiences",
      "Startup Fundraising: 10 Common Traps Every Founder Should Avoid",
      "Moderated by Gaurav Bansal - Setu Startup School",
      "Real Conversations. Real Founders. Real Impact.",
      "Build Connections. Share Experiences. Grow Together.",
    ],
  },

  story: {
    visible: true,
    headline: "This Is Not a Workshop — It Is a Real Conversation",
    description: "Most events are presentations. This is a discussion. Moderated by field experts, driven by founder questions. Because the best startup learning happens in rooms where everyone is honest about what is hard.",
    boxes: [
      {
        title: "The Isolated Founder",
        description: "Building alone with no one to reality-check ideas or share the weight.",
        bullets: [
          { text: "No peer community — navigates every challenge alone",         style: "cross" },
          { text: "Walks into fundraising blind — hits traps that were avoidable", style: "cross" },
          { text: "Lacks a trusted network of founders at the same stage",        style: "cross" },
        ],
      },
      {
        title: "The Connected Founder",
        description: "Part of a community where real problems get real answers.",
        bullets: [
          { text: "Learns from founders who have already made the mistakes",     style: "check" },
          { text: "Understands fundraising traps before meeting investors",      style: "check" },
          { text: "Builds a trusted peer network that compounds over time",      style: "check" },
        ],
      },
    ],
  },

  output: {
    image_url: "",
    headline: { text: "Who Should Attend", color: "#7C3AED" },
    bullets: [
      "Startup Founders at any stage",
      "Early-stage founders and first-time entrepreneurs",
      "Aspiring entrepreneurs exploring their first startup",
      "Anyone interested in startup fundraising and company building",
      "Professionals considering the startup path",
    ],
  },

  workshops: [
    {
      id: "cc-main", priority_order: 1, visible: true,
      icon: "☕", badge: "3.5-Hour Informal Meetup", color: "#7C3AED",
      heading: "3:30 PM – 7:00 PM",
      title: "Chai and Conversation — Founder Meetup and Discussion",
      key_features: kf("Open Founder Discussion · Fundraising Traps Decoded · Peer Networking · Moderated by Setu Startup School"),
      pricing: {
        mode: "offline",
        address: "Ofis Square, 4th Floor, Block-1, Vatika Business Park, Badshahpur Sohna Rd, Sector 49, Gurugram, Haryana 122018",
        actual_price: 0, strike_price: 0,
        date_time_bullets: ["Saturday, 1 August 2026", "3:30 PM – 7:00 PM (IST)", "In-person · Ofis Square, Gurgaon"],
      },
      cta: { text: "Event Closed", active: false },
      detail_bullets: {
        what_youll_learn: ul([
          "3:30–4:00 PM — Introductions and setting the context",
          "4:00–4:45 PM — Open Founder Discussion: challenges, lessons, and practical insights from the room",
          "4:45–5:30 PM — Startup Fundraising: 10 Common Traps Every Founder Should Avoid",
          "5:30 PM onwards — Open Networking",
          "Fundraising Traps covered: NDA Signing, Pvt Ltd incorporation, Equity Vesting, Valuation Trap (Pre vs Post), Dilution and ESOP pool, CCPS Preference trap, Reading the Soft NO of an investor, Friendly Investor Trap, Cap Table Trap, Due Diligence Trap",
        ]),
        your_deliverables: ul([
          "Peer connections with founders at the same stage",
          "Practical awareness of 10 fundraising traps to avoid",
          "Real perspectives from the open founder discussion",
          "Access to the Setu Startup School community",
        ]),
      },
    },
  ],

  mentors: {
    headline: "Discussion Moderator",
    items: [
      {
        id: "mentor-gaurav-cc",
        image_url: "",
        name: "Gaurav Bansal",
        professional_headline: "Founder, Setu Startup School | 2X Entrepreneur",
        professional_description: "Gaurav moderated the discussions and led the Fundraising Traps session. With 15+ years of experience building startups and working at organisations like Just Dial, HDFC Bank, and Idea Cellular, he brings both operator and mentor perspective.",
        credential_bullets: [
          "Founder, Setu Startup School",
          "Former Startup Mentor — IIT Delhi (DMS), IIT Madras, IIM Rohtak, Wadhwani Foundation",
          "2X Entrepreneur",
          "Former roles at Just Dial, HDFC Bank, Idea Cellular",
        ],
        visible: true, color: "#7C3AED", imagePosition: "center", badge_text: "Discussion Moderator",
      },
    ],
  },

  faqs: [
    { question: "What is the event format?",
      answer: "This is an informal discussion meetup — not a workshop or presentation. Sessions: 3:30–4:00 PM Introductions, 4:00–4:45 PM Open Founder Discussion, 4:45–5:30 PM Fundraising Traps, 5:30 PM+ Networking." },
    { question: "What fundraising traps will be discussed?",
      answer: "1. The NDA Signing trap. 2. Not having a Pvt Ltd incorporated + no Co-Founder agreement. 3. Equity Vesting and Re-vesting. 4. The Valuation Trap (Pre vs Post). 5. The Dilution conflict (ESOP pool). 6. The CCPS Preference trap. 7. Understanding the Soft NO of an investor. 8. The Friendly Investor Trap. 9. The Cap Table Trap. 10. The Due Diligence Trap." },
    { question: "Is entry free?",
      answer: "Yes, entry is free. However seats are limited. Filling the Google Form is mandatory to confirm your seat." },
    { question: "Where is the venue?",
      answer: "Ofis Square, 4th Floor, Block-1, Vatika Business Park, Badshahpur Sohna Rd, Vatika City, Block W, Sector 49, Gurugram, Haryana 122018. Google Map: https://share.google/mzi5enwSKmF5JmanQ" },
    { question: "Who should attend?",
      answer: "Startup Founders, early-stage entrepreneurs, aspiring founders, and anyone interested in startup fundraising and company building." },
    { question: "How do I contact the organiser?",
      answer: "Email: event.tss2025@gmail.com" },
  ],

  contact: {
    whatsapp: {
      headline: "Join Our Community",
      description: "Connect with founders and stay updated on upcoming events by Setu Startup School.",
      button_text: "Join WhatsApp Community",
      link: "https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t",
    },
    lead_form: {
      headline: "Stay Updated",
      subtext: "Register your interest for our next Chai and Conversation meetup.",
      submit_text: "Notify Me",
      destination_email: "event.tss2025@gmail.com",
      destination_contact_number: "",
    },
  },

  coupon: { code: "", discount_percent: 0, active: false },
  extras: {
    workshop_nudges: { enabled: false, frequency_sections: 3 },
    footer: "2026 The Startup School. All rights reserved.",
    chatbot: { enabled: false, note: "" },
  },
};

async function main() {
  const slug = "chai-and-conversation-gurgaon-1aug";
  console.log("\nChecking if event exists...");
  const existing = await getBySlug(slug);
  if (existing) {
    console.log("Already exists (id:" + existing.id + ").");
    return;
  }
  console.log("Creating event...");
  const r = await postEvent({
    title:            "Chai and Conversation with Startup Founders and Aspirants",
    description:      "An informal meetup and discussion group by Setu Startup School and Ofis Square. Real Conversations. Real Founders. Real Impact.",
    slug:             slug,
    venue:            "Ofis Square, 4th Floor, Block-1, Vatika Business Park, Badshahpur Sohna Rd, Sector 49",
    city:             "Gurugram",
    start_date:       "2026-08-01",
    start_time:       "3:30 PM",
    end_date:         "2026-08-01",
    end_time:         "7:00 PM",
    registration_url: "",
    is_past:          "true",
    is_pinned:        "false",
    is_active:        "true",
    page_blocks:      JSON.stringify(PAGE_BLOCKS),
  });

  if (r.status === 200 || r.status === 201) {
    const c = JSON.parse(r.body);
    console.log("Created : " + c.title);
    console.log("ID      : " + c.id);
    console.log("URL     : https://foundersschool.in/events/" + slug);
  } else {
    console.log("FAIL " + r.status + ": " + r.body.substring(0, 400));
  }
}

main().catch(console.error);
