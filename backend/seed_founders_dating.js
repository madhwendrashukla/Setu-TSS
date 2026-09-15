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
    top_badge: "Past Event | February 2026",
    headline: "Founders Dating and Co-Building",
    subheadline: "Find Your Perfect Co-Founder | Mumbai",
    description: "Looking for a co-founder? Pitch in 60 seconds, meet builders, and form real startup teams. A high-energy, structured Founders Dating and Co-Building Meetup — designed to help Founders and Seekers meet, evaluate, and match with the right people to build startups together.",
    key_highlights: [
      "Free entry · Limited seats (matchmaking basis)",
      "Ice-Breaking Introductions with fellow founders",
      "Expert Session on choosing the right co-founder",
      "Structured Breakout and Match-Making Sessions",
      "For Founders looking for co-founders and team members",
      "For Seekers looking to join startups",
    ],
  },

  story: {
    visible: true,
    headline: "This Is Not Casual Networking",
    description: "This is a curated, outcome-driven session focused on founder fit, skills, mindset, and real co-building potential. Most startups fail because of co-founder mismatch — not because of product or market.",
    boxes: [
      {
        title: "The Lonely Founder",
        description: "Great idea, but building alone with no one to share the weight.",
        bullets: [
          { text: "Struggles to find a co-founder who shares vision and work ethic", style: "cross" },
          { text: "Random networking events give connections but not co-builders",   style: "cross" },
          { text: "Signs up a co-founder on trust alone — ends in conflict",         style: "cross" },
        ],
      },
      {
        title: "The Matched Founder",
        description: "Walks out with the right people — not just business cards.",
        bullets: [
          { text: "Matches with co-founders on skills, mindset, and founder fit",   style: "check" },
          { text: "Structured sessions expose red flags before you commit",         style: "check" },
          { text: "Expert-guided process — not left to chance",                    style: "check" },
        ],
      },
    ],
  },

  output: {
    image_url: "",
    headline: { text: "This Event Is For", color: "#7C3AED" },
    bullets: [
      "Startup Founders looking for co-founders and team members",
      "Seekers looking to join or work at startups",
      "Builders with skills ready to find a mission-driven team",
      "Early-stage founders who want structured co-founder discovery",
      "Anyone serious about building — not just networking",
    ],
  },

  workshops: [
    {
      id: "fd-main", priority_order: 1, visible: true,
      icon: "🚀", badge: "3-Hour Co-Building Session", color: "#7C3AED",
      heading: "10:00 AM – 1:00 PM",
      title: "Founders Dating and Co-Building Meetup",
      key_features: kf("Ice-Breaking Introductions · Expert Session on Co-Founder fit · Breakout and Match-Making Sessions · Open Networking"),
      pricing: {
        mode: "offline",
        address: "10th Floor, B Wing, 215 Atrium, Vijay Nagar Colony, J B Nagar, Andheri East, Mumbai 400093",
        actual_price: 0, strike_price: 0,
        date_time_bullets: ["Saturday, 14 February 2026", "10:00 AM – 1:00 PM (IST)", "In-person · DevX, Andheri East, Mumbai"],
      },
      cta: { text: "Event Closed", active: false },
      detail_bullets: {
        what_youll_learn: ul([
          "How to evaluate a potential co-founder on skills, mindset, and values",
          "Common co-founder mistakes and how to avoid them",
          "What founder fit really means and how to test it quickly",
          "How to pitch yourself in 60 seconds to attract the right co-builder",
          "Structured match-making based on your startup idea and skill gaps",
        ]),
        your_deliverables: ul([
          "Direct connections with vetted co-founder candidates",
          "Clarity on what to look for in a co-founder",
          "Expert insights from Gaurav Bansal on co-founder dynamics",
          "Access to the WhatsApp community for ongoing matching",
        ]),
      },
    },
  ],

  mentors: {
    headline: "Expert Speaker",
    items: [
      {
        id: "mentor-gaurav-fd",
        image_url: "",
        name: "Gaurav Bansal",
        professional_headline: "Founder, Setu Startup School | 2X Entrepreneur",
        professional_description: "Gaurav led the Expert Session on choosing the right co-founder — covering common co-founder mistakes, founder fit evaluation, and how to structure early equity and role conversations.",
        credential_bullets: [
          "Founder, Setu Startup School",
          "Startup Mentor — IIT Delhi (DMS), IIT Madras, IIM Rohtak",
          "2X Entrepreneur",
        ],
        visible: true, color: "#7C3AED", imagePosition: "center", badge_text: "Expert Speaker",
      },
    ],
  },

  faqs: [
    { question: "What is the event format?",         answer: "Ice-Breaking Introductions (30-40 mins) → Expert Session on choosing the right co-founder by Gaurav Bansal → Breakout and Match-Making Sessions → Open Networking." },
    { question: "Where is the venue?",               answer: "10th Floor, B Wing, 215 Atrium, Vijay Nagar Colony, J B Nagar, Near Courtyard By Marriott, Andheri East, Mumbai 400093. Google Map: https://shorturl.at/27n5R. Doors open at 9:50 AM." },
    { question: "Is entry free?",                    answer: "Yes, entry is free. Seats are limited and allocated on a First Come and Matchmaking basis. You must fill the Google Form to confirm your seat." },
    { question: "Who is this event for?",            answer: "Startup Founders looking for co-founders and team members, and Seekers looking to join or work at startups." },
    { question: "How do I confirm my seat?",         answer: "Fill the mandatory Google Form for match-making: https://shorturl.at/YTZV1 and join the WhatsApp Community for updates: https://shorturl.at/TCmim." },
    { question: "How do I contact the organiser?",   answer: "Email: events.tss2025@gmail.com | Phone: 9993520338. For immediate queries, message in the WhatsApp group." },
  ],

  contact: {
    whatsapp: {
      headline: "Join the Community",
      description: "Join the WhatsApp Community for event updates and ongoing co-founder matching.",
      button_text: "Join WhatsApp Community",
      link: "https://shorturl.at/TCmim",
    },
    lead_form: {
      headline: "Stay Updated",
      subtext: "Register your interest for our next Founders Dating meetup.",
      submit_text: "Notify Me",
      destination_email: "events.tss2025@gmail.com",
      destination_contact_number: "9993520338",
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
  const slug = "founders-dating-mumbai-14feb";
  console.log("\nChecking if event exists...");
  const existing = await getBySlug(slug);
  if (existing) {
    console.log("Already exists (id:" + existing.id + "). Use update script if needed.");
    return;
  }

  console.log("Creating event...");
  const r = await postEvent({
    title:            "Founders Dating and Co-Building - By The Startup School and DevX",
    description:      "Looking for a co-founder? Pitch in 60 seconds, meet builders, and form real startup teams. A curated, outcome-driven Founders Dating Meetup in Mumbai.",
    slug:             slug,
    venue:            "215 Atrium, 10th Floor, B Wing, Vijay Nagar Colony, J B Nagar, Andheri East",
    city:             "Mumbai",
    start_date:       "2026-02-14",
    start_time:       "10:00 AM",
    end_date:         "2026-02-14",
    end_time:         "1:00 PM",
    registration_url: "https://shorturl.at/YTZV1",
    is_past:          "true",
    is_pinned:        "false",
    is_active:        "true",
    page_blocks:      JSON.stringify(PAGE_BLOCKS),
  });

  if (r.status === 200 || r.status === 201) {
    const created = JSON.parse(r.body);
    console.log("Created: " + created.title);
    console.log("ID     : " + created.id);
    console.log("URL    : https://foundersschool.in/events/" + slug);
  } else {
    console.log("FAIL " + r.status + ": " + r.body.substring(0, 300));
  }
}

main().catch(console.error);
