const https = require("https");
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTIxMjUwOH0.CYttfiMQMkxiq3rJ4pvx8m0pSsWaYvK_mwyeH_Yipng";

function ul(items) { return "<ul>" + items.map(i => "<li>" + i + "</li>").join("") + "</ul>"; }
function kf(text)  { return "<p>" + text + "</p>"; }

function putEvent(id, ev) {
  return new Promise((resolve, reject) => {
    const fields = {
      title: ev.title, description: ev.description, slug: ev.slug,
      venue: ev.venue, city: ev.city, start_date: ev.start_date,
      start_time: ev.start_time, end_date: ev.end_date, end_time: ev.end_time,
      registration_url: ev.registration_url,
      is_past: "true", is_pinned: "false", is_active: "true",
      page_blocks: JSON.stringify(ev.page_blocks),
    };
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
      path: "/api/admin/events/" + id, method: "PUT",
      headers: { "Authorization": "Bearer " + TOKEN, "Content-Type": "multipart/form-data; boundary=" + boundary, "Content-Length": buf.length },
    };
    const req = https.request(opts, res => {
      let d = ""; res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, snippet: d.substring(0,120) }));
    });
    req.on("error", reject);
    req.write(buf); req.end();
  });
}

const FE_WORKSHOPS = [
  { id:"fe-s1", priority_order:1, visible:true, icon:"🤝", badge:"Session 1", color:"#7C3AED",
    heading:"10:30 AM - 11:00 AM", title:"Introductions and Networking",
    key_features: kf("Networking · Icebreakers · Setting the stage"),
    pricing:{ mode:"offline", address:"The Hosteller, Mathura Rd, near Ashram Chowk", actual_price:449, strike_price:599, date_time_bullets:["Sunday, 2 August 2026","10:30 AM – 5:00 PM","In-person, Delhi NCR"] },
    cta:{ text:"Registration Closed", active:false },
    detail_bullets:{ what_youll_learn: ul(["Meet fellow founders from the Delhi NCR ecosystem","Quick founder introductions and startup spotlights","Session overview and what to expect"]), your_deliverables: ul(["Peer connections from Day 1","Context for the sessions ahead"]) } },
  { id:"fe-s2", priority_order:2, visible:true, icon:"📊", badge:"Session 2 · Core Masterclass", color:"#7C3AED",
    heading:"11:00 AM - 2:30 PM", title:"Fundraising Essentials Masterclass",
    key_features: kf("Term sheets · Cap table · Due diligence · Investor types · VC fund structure · Data room · Pitch decks"),
    pricing:{ mode:"offline", address:"The Hosteller, Mathura Rd, near Ashram Chowk", actual_price:449, strike_price:599, date_time_bullets:["Sunday, 2 August 2026","11:00 AM – 2:30 PM","In-person, Delhi NCR"] },
    cta:{ text:"Registration Closed", active:false },
    detail_bullets:{ what_youll_learn: ul(["Critical Financial Terms and Agreements one must know","Basics of Key Agreements and Term Sheet clauses","What is Due Diligence and why startups lose cheques after term sheet signing","Investor Types and Funding Stages from Seed to Series B and beyond","Who is who in a VC fund and how to approach the right person","Data Room preparation and what goes in and why","Pitch Decks structure storytelling and common mistakes"]), your_deliverables: ul(["Fundraising process roadmap","Data room checklist","Cap table model and financial jargon glossary","Pitch deck template proven structure"]) } },
  { id:"fe-s3", priority_order:3, visible:true, icon:"🍱", badge:"Break", color:"#0EA5E9",
    heading:"2:30 PM - 3:15 PM", title:"Break",
    key_features: kf("Food packets provided · Networking · Informal discussions"),
    pricing:{ mode:"offline", address:"The Hosteller, Mathura Rd, near Ashram Chowk", actual_price:449, strike_price:599, date_time_bullets:["Sunday, 2 August 2026","2:30 PM – 3:15 PM","In-person, Delhi NCR"] },
    cta:{ text:"Included in Ticket", active:false },
    detail_bullets:{ what_youll_learn: ul(["Food packets provided for all attendees","Informal networking with fellow founders","Time to prepare questions for the Q and A session"]), your_deliverables: ul(["Refreshment break","Networking time with Delhi NCR founders"]) } },
  { id:"fe-s4", priority_order:4, visible:true, icon:"🎤", badge:"Session 3 · Live Pitching", color:"#7C3AED",
    heading:"3:15 PM - 4:00 PM", title:"Live Mock Pitch Session",
    key_features: kf("Live pitches · Investor-style feedback · 3 shortlisted startups"),
    pricing:{ mode:"offline", address:"The Hosteller, Mathura Rd, near Ashram Chowk", actual_price:449, strike_price:599, date_time_bullets:["Sunday, 2 August 2026","3:15 PM – 4:00 PM","In-person, Delhi NCR"] },
    cta:{ text:"Registration Closed", active:false },
    detail_bullets:{ what_youll_learn: ul(["Three shortlisted startups pitch live to the room","Real-time feedback from Gaurav Bansal","Audience learns from each pitch critique","Founders encouraged to submit pitch decks before the event for shortlisting"]), your_deliverables: ul(["Live pitch feedback","Practical understanding of what investors notice in a pitch"]) } },
  { id:"fe-s5", priority_order:5, visible:true, icon:"💬", badge:"Session 4 · Wrap-up", color:"#0EA5E9",
    heading:"4:00 PM - 5:00 PM", title:"Open Q and A and Networking",
    key_features: kf("Open Q and A · Peer networking · Closing insights"),
    pricing:{ mode:"offline", address:"The Hosteller, Mathura Rd, near Ashram Chowk", actual_price:449, strike_price:599, date_time_bullets:["Sunday, 2 August 2026","4:00 PM – 5:00 PM","In-person, Delhi NCR"] },
    cta:{ text:"Registration Closed", active:false },
    detail_bullets:{ what_youll_learn: ul(["Open floor for any questions about fundraising term sheets or investor relations","Peer-to-peer networking with founders from Delhi NCR","Closing insights and next steps from Gaurav Bansal"]), your_deliverables: ul(["Answers to your specific fundraising questions","New founder connections from Delhi NCR ecosystem"]) } },
];

const SLP_WORKSHOPS = [
  { id:"slp-s1", priority_order:1, visible:true, icon:"📋", badge:"Session 1", color:"#7C3AED",
    heading:"11:30 AM - 12:00 PM", title:"Foundations of Startup Agreements",
    key_features: kf("Co-founder agreements · Equity structure · Vesting schedules · IP ownership"),
    pricing:{ mode:"offline", address:"Spotlight Strategic Partners, Solitaire Corporate Park, Mumbai", actual_price:0, strike_price:0, date_time_bullets:["Saturday, 11 July 2026","11:30 AM – 12:00 PM","In-person, Mumbai"] },
    cta:{ text:"Event Closed", active:false },
    detail_bullets:{ what_youll_learn: ul(["What a Co-Founder Agreement must cover","Equity split and vesting cliff structures","IP assignment and ownership clauses","What happens when a co-founder leaves"]), your_deliverables: ul(["Framework for evaluating any Co-Founder Agreement","Key clauses checklist"]) } },
  { id:"slp-s2", priority_order:2, visible:true, icon:"📄", badge:"Session 2", color:"#7C3AED",
    heading:"12:00 PM - 12:30 PM", title:"Decoding Term Sheets",
    key_features: kf("Term sheets · Liquidation preference · Anti-dilution · Control rights · Board voting"),
    pricing:{ mode:"offline", address:"Spotlight Strategic Partners, Solitaire Corporate Park, Mumbai", actual_price:0, strike_price:0, date_time_bullets:["Saturday, 11 July 2026","12:00 PM – 12:30 PM","In-person, Mumbai"] },
    cta:{ text:"Event Closed", active:false },
    detail_bullets:{ what_youll_learn: ul(["Key Term Sheet clauses every founder must understand","How liquidation preference can wipe out founder returns","Anti-dilution provisions and their impact on your stake","Board control and voting rights explained"]), your_deliverables: ul(["Term Sheet Cheat Sheet bonus for all attendees","Red flag clause checklist"]) } },
  { id:"slp-s3", priority_order:3, visible:true, icon:"💬", badge:"Session 3 · Q and A", color:"#0EA5E9",
    heading:"12:30 PM - 1:00 PM", title:"Open Q and A",
    key_features: kf("Live Q and A · Real-world scenarios · When to use AI vs a lawyer"),
    pricing:{ mode:"offline", address:"Spotlight Strategic Partners, Solitaire Corporate Park, Mumbai", actual_price:0, strike_price:0, date_time_bullets:["Saturday, 11 July 2026","12:30 PM – 1:00 PM","In-person, Mumbai"] },
    cta:{ text:"Event Closed", active:false },
    detail_bullets:{ what_youll_learn: ul(["Open floor for founder questions","Real-world legal scenarios and how to handle them","When to use AI for legal drafting and when not to","How to find the right startup lawyer"]), your_deliverables: ul(["Answers to your specific legal questions","Clarity on next steps for your startup"]) } },
];

async function main() {
  console.log("\nUpdating workshop blocks with correct structure...\n");

  // Build full page_blocks for FE (fetch current, patch workshops only)
  const FE_PB = require("./scripts/seed-past-events-data.js").PAST_EVENTS.find(e => e.slug === "fundraising-essentials-delhi-2aug").page_blocks;
  FE_PB.workshops = FE_WORKSHOPS;

  const r1 = await putEvent("770600e8-30ca-48ef-9c6e-20afd696b91f", {
    title:"Fundraising Essentials - 5Hr Masterclass at Delhi NCR",
    description:"What Every Founder Should Know Before Meeting Investors. An Intensive Offline Masterclass by Setu Startup School.",
    slug:"fundraising-essentials-delhi-2aug",
    venue:"The Hosteller, Mathura Rd, near Ashram Chowk",
    city:"New Delhi", start_date:"2026-08-02", start_time:"10:30 AM", end_date:"2026-08-02", end_time:"5:00 PM",
    registration_url:"https://tss-tr.vercel.app/url/62eda2c2",
    page_blocks: FE_PB,
  });
  console.log("FE (Delhi NCR) workshops update:", r1.status === 200 ? "✅ OK" : "❌ FAIL " + r1.status);
  if (r1.status !== 200) console.log(r1.snippet);

  const SLP_PB = require("./scripts/seed-past-events-data.js").PAST_EVENTS.find(e => e.slug === "startup-legal-playbook-11jul").page_blocks;
  SLP_PB.workshops = SLP_WORKSHOPS;

  const r2 = await putEvent("1665aa99-d318-42cd-a3f4-fce05a2b4de7", {
    title:"The StartUp Legal Playbook",
    description:"A founder-focused masterclass on term sheets, co-founder agreements, equity, dilution, and startup legal pitfalls.",
    slug:"startup-legal-playbook-11jul",
    venue:"Spotlight Strategic Partners, Solitaire Corporate Park, #Unit 1, Floor 3",
    city:"Mumbai", start_date:"2026-07-11", start_time:"11:30 AM", end_date:"2026-07-11", end_time:"2:30 PM",
    registration_url:"",
    page_blocks: SLP_PB,
  });
  console.log("SLP (Mumbai) workshops update:  ", r2.status === 200 ? "✅ OK" : "❌ FAIL " + r2.status);
  if (r2.status !== 200) console.log(r2.snippet);
  console.log("\nDone. Refresh the event pages to verify.");
}

main().catch(console.error);
