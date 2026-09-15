const https = require("https");
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTIxMjUwOH0.CYttfiMQMkxiq3rJ4pvx8m0pSsWaYvK_mwyeH_Yipng";

function ul(items) { return "<ul>" + items.map(i => "<li>" + i + "</li>").join("") + "</ul>"; }
function kf(t)     { return "<p>" + t + "</p>"; }

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
      res.on("end", () => resolve({ status: res.statusCode, snippet: d.substring(0,200) }));
    });
    req.on("error", reject);
    req.write(buf); req.end();
  });
}

const EVENTS_DATA = require("./scripts/seed-past-events-data.js").PAST_EVENTS;

// ── Fundraising Essentials Delhi — 1 workshop card ─────────────────────────
const FE_PB = EVENTS_DATA.find(e => e.slug === "fundraising-essentials-delhi-2aug").page_blocks;
FE_PB.workshops = [
  {
    id: "fe-main", priority_order: 1, visible: true,
    icon: "📊", badge: "5-Hour Offline Masterclass", color: "#7C3AED",
    heading: "10:30 AM – 5:00 PM",
    title: "Fundraising Essentials Masterclass",
    key_features: kf("Term sheets · Cap table · Due diligence · Investor types · VC fund structure · Data room · Live Mock Pitch"),
    pricing: {
      mode: "offline",
      address: "The Hosteller, Mathura Rd, near Ashram Chowk, New Delhi",
      actual_price: 449, strike_price: 599,
      date_time_bullets: ["Sunday, 2 August 2026", "10:30 AM – 5:00 PM", "In-person · Delhi NCR"],
    },
    cta: { text: "Registration Closed", active: false },
    detail_bullets: {
      what_youll_learn: ul([
        "Critical Financial Terms and Agreements one must know",
        "Basics of Key Agreements and Term Sheet clauses",
        "What is Due Diligence and why startups lose cheques after term sheet signing",
        "Investor Types and Funding Stages — Seed to Series B and beyond",
        "Who is who in a VC fund and how to approach the right person",
        "Data Room preparation — what goes in and why",
        "Pitch Decks: structure, storytelling, and common mistakes",
        "Live Mock Pitch Session — 3 shortlisted startups pitch and get feedback",
      ]),
      your_deliverables: ul([
        "Fundraising process roadmap",
        "Data room checklist",
        "Cap table model and financial jargon glossary",
        "Pitch deck template (proven structure)",
        "Live pitch feedback and investor perspective",
      ]),
    },
  },
];

// ── StartUp Legal Playbook Mumbai — 1 workshop card ────────────────────────
const SLP_PB = EVENTS_DATA.find(e => e.slug === "startup-legal-playbook-11jul").page_blocks;
SLP_PB.workshops = [
  {
    id: "slp-main", priority_order: 1, visible: true,
    icon: "⚖️", badge: "3-Hour Legal Masterclass", color: "#7C3AED",
    heading: "11:30 AM – 2:30 PM",
    title: "The StartUp Legal Playbook",
    key_features: kf("Co-founder agreements · Term sheets · Equity · Dilution · Legal red flags · When to use AI vs a lawyer"),
    pricing: {
      mode: "offline",
      address: "Spotlight Strategic Partners, Solitaire Corporate Park, #Unit 1, Floor 3, Mumbai",
      actual_price: 0, strike_price: 0,
      date_time_bullets: ["Saturday, 11 July 2026", "11:30 AM – 2:30 PM", "In-person · Mumbai"],
    },
    cta: { text: "Event Closed", active: false },
    detail_bullets: {
      what_youll_learn: ul([
        "How to structure and evaluate a Co-Founder Agreement",
        "Equity split and vesting cliff structures",
        "IP assignment and ownership clauses",
        "Key Term Sheet clauses that affect control, equity, and dilution",
        "How liquidation preference can wipe out founder returns",
        "Anti-dilution provisions and their impact on your stake",
        "Common legal red flags founders should avoid",
        "When AI can help with drafting and when it creates risk",
      ]),
      your_deliverables: ul([
        "Term Sheet Cheat Sheet (bonus for all attendees)",
        "Co-founder agreement key clauses checklist",
        "Red flag clause reference guide",
        "Clarity on when to hire a startup lawyer",
      ]),
    },
  },
];

async function main() {
  console.log("\nUpdating to single workshop card...\n");

  const r1 = await putEvent("770600e8-30ca-48ef-9c6e-20afd696b91f", {
    title: "Fundraising Essentials - 5Hr Masterclass at Delhi NCR",
    description: "What Every Founder Should Know Before Meeting Investors. An Intensive Offline Masterclass by Setu Startup School.",
    slug: "fundraising-essentials-delhi-2aug",
    venue: "The Hosteller, Mathura Rd, near Ashram Chowk",
    city: "New Delhi", start_date: "2026-08-02", start_time: "10:30 AM",
    end_date: "2026-08-02", end_time: "5:00 PM",
    registration_url: "https://tss-tr.vercel.app/url/62eda2c2",
    page_blocks: FE_PB,
  });
  console.log("FE Delhi NCR :", r1.status === 200 ? "OK — 1 workshop card" : "FAIL " + r1.status, r1.status !== 200 ? r1.snippet : "");

  const r2 = await putEvent("1665aa99-d318-42cd-a3f4-fce05a2b4de7", {
    title: "The StartUp Legal Playbook",
    description: "A founder-focused masterclass on term sheets, co-founder agreements, equity, dilution, and startup legal pitfalls.",
    slug: "startup-legal-playbook-11jul",
    venue: "Spotlight Strategic Partners, Solitaire Corporate Park, #Unit 1, Floor 3",
    city: "Mumbai", start_date: "2026-07-11", start_time: "11:30 AM",
    end_date: "2026-07-11", end_time: "2:30 PM",
    registration_url: "",
    page_blocks: SLP_PB,
  });
  console.log("SLP Mumbai   :", r2.status === 200 ? "OK — 1 workshop card" : "FAIL " + r2.status, r2.status !== 200 ? r2.snippet : "");
  console.log("\nDone. Refresh both event pages.");
}

main().catch(console.error);
