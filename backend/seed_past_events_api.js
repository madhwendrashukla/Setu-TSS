// -----------------------------------------------------------------------------
// seed_past_events_api.js
// Seeds 2 past events via the live admin REST API (no direct DB needed).
// Usage:
//   node seed_past_events_api.js            <- seed both events
//   node seed_past_events_api.js --dry-run  <- preview only
// -----------------------------------------------------------------------------

const https   = require("https");
const DRY_RUN = process.argv.includes("--dry-run");

const API_HOST = "foundersschool.in";
const TOKEN    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTIxMjUwOH0.CYttfiMQMkxiq3rJ4pvx8m0pSsWaYvK_mwyeH_Yipng";

function log(m) { console.log("  " + m); }
function ok(m)  { console.log("  ? " + m); }
function err(m) { console.error("  ? " + m); }

function httpReq(method, path, fields) {
  return new Promise((resolve, reject) => {
    const boundary = "----SetuBoundary" + Date.now();
    let body = "";
    if (fields) {
      for (const [k, v] of Object.entries(fields)) {
        body += "--" + boundary + "\r\n";
        body += 'Content-Disposition: form-data; name="' + k + '"\r\n\r\n';
        body += v + "\r\n";
      }
      body += "--" + boundary + "--\r\n";
    }
    const buf = Buffer.from(body, "utf8");
    const opts = {
      hostname: API_HOST, port: 443, path, method,
      headers: {
        "Authorization": "Bearer " + TOKEN,
        ...(fields ? {
          "Content-Type": "multipart/form-data; boundary=" + boundary,
          "Content-Length": buf.length,
        } : {}),
      },
    };
    const req = https.request(opts, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    if (fields) req.write(buf);
    req.end();
  });
}

async function getBySlug(slug) {
  const r = await httpReq("GET", "/api/events/slug/" + slug, null);
  if (r.status === 404) return null;
  try { return JSON.parse(r.body); } catch { return null; }
}

const EVENTS = [
  {
    title: "The StartUp Legal Playbook",
    description: "A founder-focused masterclass on term sheets, co-founder agreements, equity, dilution, and startup legal pitfalls.",
    slug: "startup-legal-playbook-11jul",
    venue: "Spotlight Strategic Partners, Solitaire Corporate Park, #Unit 1, Floor 3",
    city: "Mumbai",
    start_date: "2026-07-11",
    start_time: "11:30 AM",
    end_date: "2026-07-11",
    end_time: "2:30 PM",
    registration_url: "",
    is_past: "true",
    is_pinned: "false",
    is_active: "true",
    lms_course_slug: "",
    page_blocks: JSON.stringify({
      registrations_open: false,
      section_visibility: { hero:true, story:true, output:true, workshops:true, pricing:false, mentors:true, video_gallery:false, text_testimonials:false, video_testimonials:false, faqs:false, contact:true },
      hero: {
        top_badge: "Past Event | July 2026",
        headline: "The StartUp Legal Playbook",
        subheadline: "Masterclass on Term Sheets, Co-Founder Agreements and Startup Legal Pitfalls",
        description: "A founder-focused masterclass covering the agreements that shape a founder journey from co-founder discussions to fundraising conversations.",
        key_highlights: ["How to structure and evaluate a Co-Founder Agreement","Key Term Sheet clauses that affect control, equity, and dilution","Common legal mistakes and red flags founders should avoid","When AI can help with drafting and when it can create risk","Bonus: Term Sheet Cheat Sheet for all attendees"],
      },
      story: {
        visible: true,
        headline: "What Looks Like a Great Deal Can Cost You Everything",
        description: "What happens to your co-founder equity if they leave? What looks like a great term sheet can still leave founders with almost nothing on a Rs 50 Cr exit due to clauses like liquidation preference.",
        boxes: [
          { title: "The Uninformed Founder", description: "Signs agreements without understanding the implications.", bullets: [{ text: "Does not know what happens to co-founder equity on exit", style: "cross" },{ text: "Misses liquidation preference clauses in term sheets", style: "cross" },{ text: "Relies on AI drafts without legal review", style: "cross" }] },
          { title: "The Legally Prepared Founder", description: "Understands the fine print and protects their equity.", bullets: [{ text: "Structures co-founder agreements with vesting and IP clauses", style: "check" },{ text: "Reads term sheets with confidence and spots red flags", style: "check" },{ text: "Knows when to use AI and when to get a real lawyer", style: "check" }] },
        ],
      },
      output: {
        image_url: "",
        headline: { text: "What You Take Home", color: "#7C3AED" },
        bullets: ["Understanding of Co-Founder Agreement structure","Key Term Sheet clauses that affect your equity and control","List of common legal red flags to watch out for","Clarity on when AI drafting helps vs creates risk","Term Sheet Cheat Sheet for all attendees"],
      },
      workshops: [
        { id:"slp-session-1", priority_order:1, heading:"11:30 AM - 12:00 PM", title:"Foundations of Startup Agreements", key_features:"Co-founder agreements, Equity structure, Vesting schedules, IP ownership", detail_bullets:{ items:["What a Co-Founder Agreement must cover","Equity split and vesting cliff structures","IP assignment and ownership clauses","What happens when a co-founder leaves"] } },
        { id:"slp-session-2", priority_order:2, heading:"12:00 PM - 12:30 PM", title:"Decoding Term Sheets", key_features:"Term sheets, Liquidation preference, Anti-dilution, Control rights", detail_bullets:{ items:["Key Term Sheet clauses every founder must understand","How liquidation preference can wipe out founder returns","Anti-dilution provisions and their impact on your stake","Board control and voting rights explained"] } },
        { id:"slp-session-3", priority_order:3, heading:"12:30 PM - 1:00 PM", title:"Open Q and A", key_features:"Live Q and A, Audience questions, Real-world scenarios", detail_bullets:{ items:["Open floor for founder questions","Real-world legal scenarios and how to handle them","When to use AI for legal drafting and when not to","How to find the right startup lawyer"] } },
      ],
      mentors: {
        headline: "Your Speakers",
        items: [
          { name:"Khushboo Agrawal", title:"Startup Lawyer | Ex-Trilegal | NALSAR", bio:"Startup lawyer with experience at Trilegal and a NALSAR graduate. Specialises in founder agreements, term sheets, and startup legal structuring.", photo_url:"", linkedin_url:"" },
          { name:"Gaurav Bansal", title:"Founder, SETU | Ex-IIT/IIM Mentor", bio:"Founder of SETU The Startup School and an ex-IIT/IIM mentor who has guided hundreds of founders through fundraising and company building.", photo_url:"", linkedin_url:"" },
        ],
      },
      faqs: [],
      contact: {
        whatsapp: { enabled:true, label:"Join Our Community", link:"https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t" },
        lead_form: { headline:"Stay Updated", subtext:"Register your interest for our next legal masterclass.", submit_text:"Notify Me", destination_email:"info@thestartupschool.in", destination_contact_number:"" },
      },
      coupon: { code:"", discount_percent:0, active:false },
      extras: { workshop_nudges:{ enabled:false, frequency_sections:3 }, footer:"2026 The Startup School. All rights reserved.", chatbot:{ enabled:false, note:"" } },
    }),
  },
  {
    title: "Fundraising Essentials - 5Hr Masterclass at Delhi NCR",
    description: "What Every Founder Should Know Before Meeting Investors. An Intensive Offline Masterclass by Setu Startup School.",
    slug: "fundraising-essentials-delhi-2aug",
    venue: "The Hosteller, Mathura Rd, near Ashram Chowk",
    city: "New Delhi",
    start_date: "2026-08-02",
    start_time: "10:30 AM",
    end_date: "2026-08-02",
    end_time: "5:00 PM",
    registration_url: "https://tss-tr.vercel.app/url/62eda2c2",
    is_past: "true",
    is_pinned: "false",
    is_active: "true",
    lms_course_slug: "",
    page_blocks: JSON.stringify({
      registrations_open: false,
      section_visibility: { hero:true, story:true, output:true, workshops:true, pricing:true, mentors:true, video_gallery:false, text_testimonials:false, video_testimonials:false, faqs:true, contact:true },
      hero: {
        top_badge: "Past Event | August 2026",
        headline: "Fundraising Essentials",
        subheadline: "What Every Founder Should Know Before Meeting Investors",
        description: "Do you think fundraising is just about building a great pitch deck? This intensive 5-hour offline masterclass will change how you think about raising capital.",
        key_highlights: ["5-hour intensive offline masterclass","Live Mock Pitch Session with real feedback","Critical financial terms and agreements decoded","Investor database and funding stage overview","Data Room preparation walkthrough","96 founders already trained"],
      },
      story: {
        visible: true,
        headline: "Do You Know What Investors Really Look For?",
        description: "Which investor is the right fit for your startup? Who within a VC firm should you actually approach? How do ESOPs impact your ownership? What happens after a Term Sheet is signed?",
        boxes: [
          { title: "The Unprepared Founder", description: "Goes into investor meetings with passion but no structure.", bullets: [{ text:"Does not know which investor type fits their stage", style:"cross" },{ text:"Stumbles on due diligence and loses deal after term sheet", style:"cross" },{ text:"Unaware how ESOPs and cap table dilution work", style:"cross" }] },
          { title: "The Masterclass Graduate", description: "Walks in confident and speaks the investor language.", bullets: [{ text:"Maps the right investor type to their funding stage", style:"check" },{ text:"Prepares a data room that passes due diligence with ease", style:"check" },{ text:"Negotiates from knowledge not desperation", style:"check" }] },
        ],
      },
      output: {
        image_url: "",
        headline: { text:"What You Will Take Home", color:"#7C3AED" },
        bullets: ["Critical Financial Terms and Agreements every founder must know","Basics of Key Agreements and Term Sheet","Understanding Due Diligence and why startups lose deals post term sheet","Investor Types and Funding Stages overview","Who is who in a VC fund and how to approach them","Data Room Preparation checklist","Pitch Deck structure and discussion framework","Live feedback from Mock Pitch session"],
      },
      workshops: [
        { id:"fe-session-1", priority_order:1, heading:"10:30 AM - 11:00 AM", title:"Introductions and Networking", key_features:"Networking, Icebreakers, Setting the stage", detail_bullets:{ items:["Meet fellow founders from the Delhi NCR ecosystem","Quick founder introductions and startup spotlights","Session overview and what to expect"] } },
        { id:"fe-session-2", priority_order:2, heading:"11:00 AM - 2:30 PM", title:"Fundraising Essentials Masterclass", key_features:"Term sheets, Cap table, Due diligence, Investor types, VC fund structure", detail_bullets:{ items:["Critical Financial Terms and Agreements one must know","Basics of Key Agreements and Term Sheet clauses","What is Due Diligence and why startups lose cheques after term sheet signing","Investor Types and Funding Stages from Seed to Series B and beyond","Who is who in a VC fund and how to approach the right person","Data Room preparation and what goes in and why","Pitch Decks structure storytelling and common mistakes"] } },
        { id:"fe-session-3", priority_order:3, heading:"2:30 PM - 3:15 PM", title:"Break", key_features:"Food packets provided, Networking, Informal discussions", detail_bullets:{ items:["Food packets provided for all attendees","Informal networking with fellow founders","Time to prepare questions for the Q and A session"] } },
        { id:"fe-session-4", priority_order:4, heading:"3:15 PM - 4:00 PM", title:"Live Mock Pitch Session", key_features:"Live pitches, Investor feedback, 3 shortlisted startups", detail_bullets:{ items:["Three shortlisted startups pitch live to the room","Real-time feedback from Gaurav Bansal","Audience learns from each pitch critique","Founders encouraged to submit pitch decks before the event for shortlisting"] } },
        { id:"fe-session-5", priority_order:5, heading:"4:00 PM - 5:00 PM", title:"Open Q and A and Networking", key_features:"Open Q and A, Networking, Wrap-up", detail_bullets:{ items:["Open floor for any questions about fundraising term sheets or investor relations","Peer-to-peer networking with founders from Delhi NCR","Closing insights and next steps from the host"] } },
      ],
      pricing_options: [
        { id:"fe-ticket-standard", priority_order:1, heading:"Masterclass Ticket", title:"Fundraising Essentials Full Day Access", key_features:"5-hour masterclass, Mock Pitch, Networking, Food break included", pricing:{ strike_price:599, actual_price:449, date_time_bullets:["Sunday 2 August 2026","10:30 AM to 5:00 PM","In-person at The Hosteller Delhi NCR"], mode:"offline", address:"The Hosteller, Mathura Rd, near Ashram Chowk, New Delhi" }, cta:{ text:"Registration Closed", active:false }, visible:true },
      ],
      mentors: {
        headline: "Your Mentor",
        items: [
          { id:"mentor-gaurav-bansal", image_url:"", name:"Gaurav Bansal", professional_headline:"Founder, Setu Startup School | 2X Entrepreneur", professional_description:"Gaurav is a 2X entrepreneur and founder of Setu Startup School. He has mentored hundreds of founders across IIT Delhi, IIT Madras, and IIM Rohtak.", credential_bullets:["Founder, Setu Startup School","Startup Mentor at IIT Delhi (DMS)","Startup Mentor at IIT Madras and IIM Rohtak","2X Entrepreneur"], visible:true, color:"#7C3AED", imagePosition:"center", badge_text:"Lead Mentor" },
        ],
      },
      faqs: [
        { question:"What is the detailed event flow?", answer:"10:30 AM to 11:00 AM: Introductions and Networking. 11:00 AM to 2:30 PM: Fundraising Essentials Masterclass. 2:30 PM to 3:15 PM: Break with food packets. 3:15 PM to 4:00 PM: Live Mock Pitch Session. 4:00 PM to 5:00 PM: Open Q and A and Networking." },
        { question:"Where is the venue?", answer:"The Hosteller, Mathura Rd, near Ashram Chowk, New Delhi. Register at: https://tss-tr.vercel.app/url/62eda2c2" },
        { question:"What is the ticket price?", answer:"Rs 449 per person." },
        { question:"What will I learn at this masterclass?", answer:"Critical Financial Terms and Agreements, Key Agreements and Term Sheet basics, Due Diligence explained, Investor Types and Funding Stages, Who is who in a VC fund, Data Room Preparation, and Pitch Decks and Discussions." },
        { question:"What is the Mock Pitch Opportunity?", answer:"Three shortlisted startups will present a live pitch and receive practical feedback. Submit your pitch deck before the event to be considered." },
        { question:"What are the break timings?", answer:"Break is from 2:30 PM to 3:15 PM. Food packets will be provided during this time." },
        { question:"Will any food or snacks be provided?", answer:"Yes. Food packets will be provided during the break from 2:30 PM to 3:15 PM." },
        { question:"How do I contact the organiser?", answer:"Email: events.tss2025@gmail.com | Call: 8810461213" },
      ],
      contact: {
        whatsapp: { headline:"Have Questions?", description:"Reach out to us for any queries about the event.", button_text:"Join WhatsApp Group", link:"https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t" },
        lead_form: { headline:"Stay Updated", subtext:"Register your interest for our next masterclass in Delhi.", submit_text:"Notify Me", destination_email:"events.tss2025@gmail.com", destination_contact_number:"8810461213" },
      },
      coupon: { code:"", discount_percent:0, active:false },
      extras: { workshop_nudges:{ enabled:false, frequency_sections:3 }, footer:"2026 The Startup School. All rights reserved.", chatbot:{ enabled:false, note:"" } },
    }),
  },
];

async function seed() {
  console.log("\n================================================================");
  console.log(DRY_RUN ? " SEED PAST EVENTS VIA API [DRY RUN]" : " SEED PAST EVENTS VIA API");
  console.log("================================================================\n");

  const results = { created:[], updated:[], failed:[] };

  for (const ev of EVENTS) {
    const { slug, title, page_blocks, ...rest } = ev;

    if (DRY_RUN) {
      log("[DRY RUN] Would upsert: " + title + " (slug: " + slug + ")");
      continue;
    }

    log('Processing: "' + title + '" ...');
    const fields = { ...rest, slug, title, page_blocks };
    if (!fields.banner_url) delete fields.banner_url;
    if (!fields.lms_course_slug) delete fields.lms_course_slug;

    try {
      const existing = await getBySlug(slug);
      let r;
      if (existing && existing.id) {
        log("  Exists (id:" + existing.id + ") - updating ...");
        r = await httpReq("PUT", "/api/admin/events/" + existing.id, fields);
        if (r.status === 200) { ok("Updated: " + title); results.updated.push(slug); }
        else { err("PUT " + r.status + ": " + r.body); results.failed.push(slug); }
      } else {
        r = await httpReq("POST", "/api/admin/events", fields);
        if (r.status === 200 || r.status === 201) {
          const c = JSON.parse(r.body);
          ok("Created: " + title + " (id:" + c.id + ")");
          log("  URL: https://" + API_HOST + "/events/" + slug);
          results.created.push(slug);
        } else { err("POST " + r.status + ": " + r.body); results.failed.push(slug); }
      }
    } catch(e) { err("Exception: " + e.message); results.failed.push(slug); }

    console.log("");
  }

  console.log("-- Summary ----------------------------------------------");
  if (results.created.length) ok("Created: " + results.created.join(", "));
  if (results.updated.length) ok("Updated: " + results.updated.join(", "));
  if (results.failed.length)  err("Failed:  " + results.failed.join(", "));
  if (!results.failed.length) ok("All done!");
  console.log("");
}

seed().catch(e => { err("Fatal: " + e.message); process.exit(1); });
