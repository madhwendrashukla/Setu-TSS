const https = require("https");

const API_HOST = "foundersschool.in";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDQwNDQ1MH0.J9B2SKwqblHbdbavVohMhCc_xLl3KQpUk1wDH2Xft1I";

function ul(items) {
  return "<ul>" + items.map(i => "<li>" + i + "</li>").join("") + "</ul>";
}
function kf(t) {
  return "<p>" + t + "</p>";
}

function httpReq(method, path, bodyBuffer, contentType) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: API_HOST,
      port: 443,
      path: path,
      method: method,
      headers: {
        Authorization: "Bearer " + TOKEN,
      },
    };
    if (bodyBuffer) {
      opts.headers["Content-Type"] = contentType;
      opts.headers["Content-Length"] = bodyBuffer.length;
    }
    const req = https.request(opts, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(d);
        } catch (_) {}
        resolve({ status: res.statusCode, body: d, json: json });
      });
    });
    req.on("error", reject);
    if (bodyBuffer) req.write(bodyBuffer);
    req.end();
  });
}

function postMultipart(path, method, fields) {
  const boundary = "----Boundary" + Date.now();
  let body = "";
  for (const [k, v] of Object.entries(fields)) {
    body += "--" + boundary + "\r\n";
    body += 'Content-Disposition: form-data; name="' + k + '"\r\n\r\n';
    body += (v !== null && v !== undefined ? String(v) : "") + "\r\n";
  }
  body += "--" + boundary + "--\r\n";
  const buf = Buffer.from(body, "utf8");
  return httpReq(method, path, buf, "multipart/form-data; boundary=" + boundary);
}

const EVENTS = [
  // ─────────────────────────────────────────────────────────────────────────────
  // EVENT 1: Chai & Conversation — Bhubaneswar (03-10-2026)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "chai-and-conversation-bhubaneswar-3oct",
    title: "Chai & Conversation — Bhubaneswar",
    description: "What if your next big startup idea is already within reach? Join a candid founder conversation on how to discover, challenge and validate startup ideas before investing your time, money and energy into building them.",
    venue: "TBD, Bhubaneswar",
    city: "Bhubaneswar",
    start_date: "2026-10-03",
    start_time: "3:00 PM",
    end_date: "2026-10-03",
    end_time: "6:00 PM",
    registration_url: "",
    is_past: "false",
    is_pinned: "false",
    is_active: "true",
    page_blocks: {
      registrations_open: true,
      section_visibility: {
        hero: true,
        story: true,
        output: true,
        workshops: true,
        pricing: true,
        mentors: true,
        video_gallery: false,
        text_testimonials: false,
        video_testimonials: false,
        faqs: true,
        contact: true,
      },
      hero: {
        top_badge: "Founder Meetup · 3 October 2026",
        headline: "Chai & Conversation: How to Ideate & Validate a Billion-Dollar Startup Idea",
        subheadline: "An informal meetup & discussion group by Setu Startup School | Bhubaneswar",
        description: "What if your next big startup idea is already within reach? And what if the right problem could unlock an opportunity you haven’t seen yet? Join a candid founder conversation on how to discover, challenge and validate startup ideas before investing your time, money and energy into building them.",
        key_highlights: [
          "3-Hour Open Founder Discussion & Meetup",
          "Ideation & Problem-Validation Frameworks",
          "Turning Everyday Observations into Opportunities",
          "Understanding Real Customer Pain Points",
          "Hosted by Gaurav Bansal (Founder, Setu Startup School)",
          "Exclusive Networking with Aspiring & Early-Stage Founders",
        ],
      },
      story: {
        visible: true,
        headline: "The Idea Explorer vs. The Builder",
        description: "Every startup begins with an idea. But an idea alone doesn't make a startup. The real question is: Is this a problem worth solving, for people who actually care enough to pay for a solution? Rather than a conventional lecture, this is an open conversation around problems, opportunities, customers, and validation.",
        boxes: [
          {
            title: "The Idea Explorer",
            description: "Struggles to turn observations and thoughts into viable, scalable business opportunities.",
            bullets: [
              { text: "Has ideas but struggles to identify which one is truly worth pursuing", style: "cross" },
              { text: "Starts building product before validating the problem with real customers", style: "cross" },
              { text: "Relies on assumptions instead of deep customer insight and market demand", style: "cross" },
            ],
          },
          {
            title: "The Builder",
            description: "Follows a structured validation framework before investing time and money.",
            bullets: [
              { text: "Identifies problems and customer willingness-to-pay before solutions", style: "check" },
              { text: "Tests assumptions early and stress-tests problem-solution fit", style: "check" },
              { text: "Validates demand before building — knows what to build, why it matters, and what to test next", style: "check" },
            ],
          },
        ],
      },
      output: {
        headline: '<p>What&nbsp;to&nbsp;<span style="color: rgb(153, 51, 255);">Expect</span></p>',
        image_url: "https://setu-tss-uploads.s3.ap-south-1.amazonaws.com/1789312438661-ChatGPT-Image-Mar-5--2026--11_47_41-AM.jpg",
        bullets: [
          "Clarity on how to approach startup ideation and evaluate opportunities",
          "Practical frameworks for evaluating problem-solution fit and market size",
          "A better understanding of customer pain points and willingness to pay",
          "New perspectives and stress-testing on your own startup ideas",
          "A clearer approach to validating ideas before investing heavily in them",
          "Exposure to different founder perspectives, challenges and experiences",
          "Meaningful conversations with aspiring and early-stage entrepreneurs",
          "Practical next steps for taking an idea forward from 0 to 1",
        ],
      },
      workshops: [
        {
          id: "cc-bbsr-main",
          priority_order: 1,
          visible: true,
          icon: "☕",
          badge: "3-Hour Founder Meetup",
          color: "#7C3AED",
          heading: "3:00 PM – 6:00 PM",
          title: "Chai & Conversation — Ideation & Validation Meetup",
          key_features: kf("3-Hour Casual Meetup · Open Founder Discussion · Ideation & Validation Frameworks · Peer Networking"),
          pricing: {
            mode: "offline",
            address: "TBD, Bhubaneswar",
            actual_price: 299,
            strike_price: 499,
            date_time_bullets: [
              "Saturday, 3 October 2026",
              "3:00 PM – 6:00 PM (IST)",
              "In-person · TBD, Bhubaneswar",
            ],
          },
          cta: { text: "Book Seat Now", active: true },
          detail_bullets: {
            what_youll_learn: ul([
              "How to identify problems and opportunities worth building a Billion Dollar Startup",
              "Turning everyday observations into business opportunities",
              "How to distinguish an interesting idea from a real business opportunity",
              "Understanding customer pain points before writing code or building",
              "How to validate an idea before investing time and money heavily in it",
              "What founders should learn from potential customer discovery conversations",
              "How to think about market size, customer willingness to pay, and scalability",
              "Common mistakes founders make while validating ideas",
              "When to pursue an idea, rethink/pivot, or walk away",
            ]),
            your_deliverables: ul([
              "Practical frameworks for evaluating and validating startup opportunities",
              "Constructive feedback and stress-testing on your own startup ideas",
              "Direct networking with early-stage builders and aspiring founders",
              "Clear, actionable next steps to move your startup forward",
              "Access to the Setu Startup School community",
            ]),
          },
        },
      ],
      pricing_options: [
        {
          id: "cc-bbsr-pass",
          priority_order: 1,
          visible: true,
          title: "Chai & Conversation — Bhubaneswar Pass",
          heading: "Meetup Pass",
          pricing: {
            mode: "offline",
            address: "TBD, Bhubaneswar",
            actual_price: 299,
            strike_price: 499,
            date_time_bullets: [
              "Saturday, 3 October 2026",
              "3:00 PM – 6:00 PM (IST)",
              "In-person · Bhubaneswar",
            ],
          },
          key_features: ul([
            "3-Hour Intensive Meetup & Open Discussion",
            "Ideation & Validation Frameworks",
            "Feedback on your Startup Ideas",
            "Peer Founder Networking & Chai",
          ]),
          cta: { text: "Reserve Your Spot", active: true },
        },
      ],
      mentors: {
        section_headline: "Meet Your Mentor",
        headline: "Discussion Host & Mentor",
        items: [
          {
            id: "mentor-gaurav-bansal-bbsr",
            name: "Gaurav Bansal",
            image_url: "https://setu-tss-uploads.s3.ap-south-1.amazonaws.com/1789040111649-gaurav.jpg",
            badge_text: "Discussion Host",
            color: "#7C3AED",
            imagePosition: "center",
            professional_headline: "Founder, Setu Startup School | Author & 2X Entrepreneur",
            professional_description: "Gaurav helps founders turn early-stage ideas into scalable businesses and prepare for growth and fundraising. As a 2X entrepreneur, he brings hands-on startup experience and mentoring expertise, helping founders make sharper strategic decisions and build with greater clarity.",
            credential_bullets: [
              "Founder, Setu Startup School",
              "Author & 2X Entrepreneur (15+ years experience)",
              "Former Startup Mentor at IIT Delhi (DMS), IIT Madras & IIM Rohtak",
              "Mentored through leading ecosystems including Wadhwani Foundation",
              "Professional experience with Justdial, HDFC Bank & Idea Cellular",
              "Expertise across startup building, strategy, fundraising & entrepreneurship",
            ],
            visible: true,
          },
        ],
      },
      faqs: [
        {
          question: "Who can attend this event?",
          answer: "The meetup is open to aspiring founders, idea-stage entrepreneurs, early-stage founders, students, professionals and anyone seriously exploring entrepreneurship.",
        },
        {
          question: "Do I need to have a startup idea?",
          answer: "No. The discussion is designed for both people who are still looking for an idea and founders who are already building.",
        },
        {
          question: "Is this a formal workshop?",
          answer: "No. It follows a casual Chai & Conversation format with open discussion, practical insights, questions and interaction.",
        },
        {
          question: "Can I discuss my own startup idea?",
          answer: "Yes. Participants are encouraged to bring their ideas, questions and challenges into the conversation.",
        },
        {
          question: "Do I need prior startup experience?",
          answer: "No. The session is designed to be accessible to first-time entrepreneurs as well as people already building.",
        },
        {
          question: "What will I learn?",
          answer: "You will gain practical perspectives and frameworks for identifying, evaluating and validating startup opportunities.",
        },
        {
          question: "How long is the event?",
          answer: "Approximately 3 hours (3:00 PM to 6:00 PM).",
        },
        {
          question: "Is the event free?",
          answer: "No. This is a paid event (Ticket Price: ₹299).",
        },
      ],
      contact: {
        whatsapp: {
          headline: "Join Our Community",
          description: "Connect with founders and stay updated on upcoming events and cohorts by Setu Startup School.",
          button_text: "Join WhatsApp Community",
          link: "https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t",
        },
        lead_gen: {
          headline: "Stay Updated",
          subtext: "Register your interest or ask questions about our upcoming Bhubaneswar meetups.",
          submit_text: "Submit Inquiry",
          admin_email: "events.tss2025@gmail.com",
          lead_source_tag: "chai_conversation_bhubaneswar",
        },
      },
      coupon: { code: "", discount_percent: 0, active: false },
      extras: {
        workshop_nudges: { enabled: false, frequency_sections: 3 },
        footer: "© 2026 Setu Startup School. All rights reserved.",
        chatbot: { enabled: false, note: "" },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // EVENT 2: Fundraising Essentials — Bhubaneswar (04-10-2026)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "fundraising-essentials-bhubaneswar-4oct",
    title: "Fundraising Essentials — Bhubaneswar",
    description: "Do you think fundraising is just about building a great pitch deck? What happens after you pitch? Which terms can you negotiate? Setu Startup School brings you a 5-hour intensive offline masterclass going beyond the pitch deck—from fundraising fundamentals and investor strategy to Term Sheets, due diligence, data rooms, ESOPs and live mock pitch feedback.",
    venue: "TBD, Bhubaneswar",
    city: "Bhubaneswar",
    start_date: "2026-10-04",
    start_time: "11:00 AM",
    end_date: "2026-10-04",
    end_time: "5:00 PM",
    registration_url: "",
    is_past: "false",
    is_pinned: "false",
    is_active: "true",
    page_blocks: {
      registrations_open: true,
      section_visibility: {
        hero: true,
        story: true,
        output: true,
        workshops: true,
        pricing: true,
        mentors: true,
        video_gallery: false,
        text_testimonials: false,
        video_testimonials: false,
        faqs: true,
        contact: true,
      },
      hero: {
        top_badge: "Offline Masterclass · 4 October 2026",
        headline: "Decoding Term Sheet & Fundraising Essentials",
        subheadline: "What Every Founder Should Know Before Meeting Investors | Bhubaneswar",
        description: "Do you think fundraising is just about building a great pitch deck? What happens after you pitch? Which terms can you negotiate? What should you know before signing a Term Sheet? And why do some startups lose the deal even after receiving investor interest? Setu Startup School brings you a 5-hour intensive offline masterclass that goes beyond the pitch deck.",
        key_highlights: [
          "5-Hour Intensive Offline Masterclass + Live Mock Pitch",
          "Decoding Term Sheets, Clauses & Negotiation Strategies",
          "Cap Tables, Dilution, Valuation & ESOP Pool Structuring",
          "Data Room Preparation & Navigating Due Diligence Traps",
          "Bonus Takeaway: Access to 60+ Pitch Decks & Media Decks",
          "Mentored by Gaurav Bansal (Founder, Setu Startup School | 2X Entrepreneur)",
        ],
      },
      story: {
        visible: true,
        headline: "The Unprepared Founder vs. The Fundraising-Ready Founder",
        description: "Getting an investor meeting is only the beginning. A founder needs to understand the fundraising process, the language investors speak, and the terms that shape ownership and control of the company.",
        boxes: [
          {
            title: "The Unprepared Founder",
            description: "Walks into investor meetings with passion, but without a clear understanding of the fundraising process.",
            bullets: [
              { text: "Doesn't know which investor type fits their stage and sector", style: "cross" },
              { text: "Struggles with due diligence and can lose the deal after a Term Sheet", style: "cross" },
              { text: "Doesn't fully understand ESOPs, cap tables, valuation, or dilution", style: "cross" },
              { text: "Enters negotiations without understanding key legal and financial clauses", style: "cross" },
            ],
          },
          {
            title: "The Fundraising-Ready Founder",
            description: "Walks into the conversation prepared and speaks the investor's language.",
            bullets: [
              { text: "Matches the right investor type to their funding stage and traction", style: "check" },
              { text: "Prepares a structured data room that passes due diligence smoothly", style: "check" },
              { text: "Understands Term Sheets, ownership, voting rights, and liquidation preferences", style: "check" },
              { text: "Negotiates from knowledge, leverage, and clarity — not desperation", style: "check" },
            ],
          },
        ],
      },
      output: {
        headline: '<p>What&nbsp;You&#39;ll&nbsp;<span style="color: rgb(153, 51, 255);">Learn &amp; Take Home</span></p>',
        image_url: "https://setu-tss-uploads.s3.ap-south-1.amazonaws.com/1789312438661-ChatGPT-Image-Mar-5--2026--11_47_41-AM.jpg",
        bullets: [
          "Critical financial and fundraising terms every founder must know",
          "Investor types and funding stages (Angel, Micro-VC, VC, Family Offices)",
          "Who's who in a VC fund and how to approach the right decision-maker",
          "Basics of key agreements and in-depth Term Sheet clause decoding",
          "Due diligence walkthrough & why deals fall through after signing a Term Sheet",
          "Data Room preparation checklist & Cap Table / ESOP dilution models",
          "Pitch deck structure, storytelling, and avoiding common pitching pitfalls",
          "Live Mock Pitch session with practical, real-time mentor feedback",
          "Bonus Takeaway: Access to 60+ real Pitch Decks & Media Decks",
        ],
      },
      workshops: [
        {
          id: "fe-bbsr-main",
          priority_order: 1,
          visible: true,
          icon: "🚀",
          badge: "5-Hour Offline Masterclass",
          color: "#7C3AED",
          heading: "11:00 AM – 5:00 PM",
          title: "Fundraising Essentials Masterclass + Live Mock Pitch",
          key_features: kf("Term Sheets · Cap Table & ESOPs · Due Diligence · Data Room · Live Mock Pitch · Bhubaneswar"),
          pricing: {
            mode: "offline",
            address: "TBD, Bhubaneswar",
            actual_price: 1499,
            strike_price: 2499,
            date_time_bullets: [
              "Sunday, 4 October 2026",
              "11:00 AM – 5:00 PM (IST)",
              "In-person · TBD, Bhubaneswar",
            ],
          },
          cta: { text: "Book Seat Now", active: true },
          detail_bullets: {
            what_youll_learn: ul([
              "Critical financial and fundraising terms every founder must know",
              "Investor types and funding stages (Pre-Seed to Series A and beyond)",
              "Who's who in a VC fund and how to approach the right person",
              "Basics of key agreements (SHA, SSA) and Term Sheet clauses",
              "How to read, analyze, and negotiate a Term Sheet with confidence",
              "What is Due Diligence and why many startups don't receive a cheque even after signing",
              "Data Room preparation: structure, documents, and best practices",
              "Cap table management, founder dilution, CCPS preferences, and ESOP pools",
              "Pitch Deck structure, storytelling, and common pitching mistakes",
              "Live Mock Pitch Session — shortlisted startups pitch and receive mentor feedback",
              "What happens step-by-step after a Term Sheet is signed",
            ]),
            your_deliverables: ul([
              "Complete Fundraising Process Roadmap & Term Sheet Cheat Sheet",
              "Data Room Preparation Checklist & Cap Table Model",
              "Access to 60+ real Pitch Decks & Media Decks",
              "Live pitch feedback and investor perspective",
              "Food packets provided during the break",
            ]),
          },
        },
      ],
      pricing_options: [
        {
          id: "fe-bbsr-pass",
          priority_order: 1,
          visible: true,
          title: "Fundraising Essentials — Bhubaneswar Masterclass Pass",
          heading: "Masterclass Pass",
          pricing: {
            mode: "offline",
            address: "TBD, Bhubaneswar",
            actual_price: 1499,
            strike_price: 2499,
            date_time_bullets: [
              "Sunday, 4 October 2026",
              "11:00 AM – 5:00 PM (IST)",
              "In-person · Bhubaneswar",
            ],
          },
          key_features: ul([
            "5-Hour Intensive Masterclass & Live Mock Pitch",
            "Term Sheet, Cap Table & Due Diligence Playbook",
            "Access to 60+ Pitch Decks & Templates",
            "Food Packets Included During Break",
          ]),
          cta: { text: "Book Your Seat Now", active: true },
        },
      ],
      mentors: {
        section_headline: "Meet Your Mentor",
        headline: "Masterclass Mentor",
        items: [
          {
            id: "mentor-gaurav-bansal-fe-bbsr",
            name: "Gaurav Bansal",
            image_url: "https://setu-tss-uploads.s3.ap-south-1.amazonaws.com/1789040111649-gaurav.jpg",
            badge_text: "Lead Mentor",
            color: "#7C3AED",
            imagePosition: "center",
            professional_headline: "Founder, Setu Startup School | 2X Entrepreneur",
            professional_description: "Gaurav brings 15+ years of experience across startups and large organisations, combining hands-on business experience with extensive founder mentoring across IIT Delhi, IIT Madras, and IIM Rohtak.",
            credential_bullets: [
              "Founder, Setu Startup School",
              "Author & 2X Entrepreneur (15+ years experience)",
              "Former Startup Mentor at IIT Delhi (DMS), IIT Madras & IIM Rohtak",
              "Mentoring experience with Wadhwani Foundation and top entrepreneurship ecosystems",
              "Professional experience with Justdial, HDFC Bank & Idea Cellular",
              "Expertise across startup building, strategy, fundraising & negotiations",
            ],
            visible: true,
          },
        ],
      },
      faqs: [
        {
          question: "Who should attend?",
          answer: "Aspiring founders, early-stage founders, founders already speaking to investors, and entrepreneurs preparing for or exploring fundraising.",
        },
        {
          question: "Do I need to be fundraising currently?",
          answer: "No. The session is also useful for founders who want to understand the process before approaching investors.",
        },
        {
          question: "What will I learn at this masterclass?",
          answer: "Critical Financial Terms and Agreements one must know · Basics of Key Agreements and Term Sheet · What is Due Diligence and why many startups don't receive a cheque even after term sheet signing · Investors Types and Funding Stages overview · Who's who in a VC fund and how to approach them · Data Room Preparation · Pitch Decks and Discussions.",
        },
        {
          question: "Will the session cover Term Sheets?",
          answer: "Yes. Term Sheet fundamentals and key clauses are a core part of the session.",
        },
        {
          question: "Is there a mock pitch?",
          answer: "Yes. Selected startups can pitch and receive practical mentor feedback.",
        },
        {
          question: "Is the event free?",
          answer: "No. This is a paid masterclass (Ticket Price: ₹1499).",
        },
        {
          question: "How long is the masterclass?",
          answer: "Approximately 5 hours (11:00 AM to 5:00 PM).",
        },
        {
          question: "Will any food/snacks be provided?",
          answer: "Yes! Food packets will be provided during the break.",
        },
      ],
      contact: {
        whatsapp: {
          headline: "Have Questions?",
          description: "Reach out to us directly for any queries about the masterclass or registration.",
          button_text: "Join WhatsApp Community",
          link: "https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t",
        },
        lead_gen: {
          headline: "Request a Callback",
          subtext: "Leave your details and our team will get in touch with you shortly.",
          submit_text: "Request Callback",
          admin_email: "events.tss2025@gmail.com",
          lead_source_tag: "fundraising_essentials_bhubaneswar",
        },
      },
      coupon: { code: "", discount_percent: 0, active: false },
      extras: {
        workshop_nudges: { enabled: false, frequency_sections: 3 },
        footer: "© 2026 Setu Startup School. All rights reserved.",
        chatbot: { enabled: false, note: "" },
      },
    },
  },
];

async function seed() {
  console.log("=================================================");
  console.log(" Seeding 2 New Bhubaneswar Events & Builder Pages");
  console.log(" Host: " + API_HOST);
  console.log("=================================================\n");

  for (const ev of EVENTS) {
    console.log(`\nProcessing: "${ev.title}" (slug: ${ev.slug})...`);

    // Check if event already exists
    const checkRes = await httpReq("GET", "/api/events/slug/" + ev.slug, null);
    const existing = checkRes.status === 200 ? checkRes.json : null;

    const payload = {
      title: ev.title,
      description: ev.description,
      venue: ev.venue,
      city: ev.city,
      start_date: ev.start_date,
      start_time: ev.start_time,
      end_date: ev.end_date,
      end_time: ev.end_time,
      registration_url: ev.registration_url,
      is_past: ev.is_past,
      is_pinned: ev.is_pinned,
      is_active: ev.is_active,
      slug: ev.slug,
      page_blocks: JSON.stringify(ev.page_blocks),
    };

    let res;
    if (existing && existing.id) {
      console.log(`  Updating existing event ID: ${existing.id}`);
      res = await postMultipart("/api/admin/events/" + existing.id, "PUT", payload);
    } else {
      console.log(`  Creating new event...`);
      res = await postMultipart("/api/admin/events", "POST", payload);
    }

    if (res.status === 200 || res.status === 201) {
      console.log(`  ✅ SUCCESS (${res.status})`);
      const result = res.json || {};
      console.log(`     ID  : ${result.id || existing?.id}`);
      console.log(`     Slug: ${result.slug || ev.slug}`);
      console.log(`     URL : https://${API_HOST}/events/${result.slug || ev.slug}`);
    } else {
      console.error(`  ❌ FAILED (${res.status}): ${res.body.substring(0, 300)}`);
    }
  }

  console.log("\n=================================================");
  console.log(" Seeding Finished!");
  console.log("=================================================");
}

seed().catch(console.error);
