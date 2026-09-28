const https = require("https");
const http = require("http");
const fs = require("fs");

const PROD_HOST = "foundersschool.in";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDQwNDQ1MH0.J9B2SKwqblHbdbavVohMhCc_xLl3KQpUk1wDH2Xft1I";

function httpReq(hostname, port, isHttps, method, path, bodyBuffer, contentType, token) {
  return new Promise((resolve, reject) => {
    const lib = isHttps ? https : http;
    const opts = {
      hostname: hostname,
      port: port,
      path: path,
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if (bodyBuffer) {
      opts.headers["Content-Type"] = contentType;
      opts.headers["Content-Length"] = bodyBuffer.length;
    }
    const req = lib.request(opts, (res) => {
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

function postMultipart(hostname, port, isHttps, path, method, fields, token) {
  const boundary = "----Boundary" + Date.now();
  let body = "";
  for (const [k, v] of Object.entries(fields)) {
    body += "--" + boundary + "\r\n";
    body += 'Content-Disposition: form-data; name="' + k + '"\r\n\r\n';
    body += (v !== null && v !== undefined ? String(v) : "") + "\r\n";
  }
  body += "--" + boundary + "--\r\n";
  const buf = Buffer.from(body, "utf8");
  return httpReq(hostname, port, isHttps, method, path, buf, "multipart/form-data; boundary=" + boundary, token);
}

async function run() {
  console.log("Reading template from bhubaneswar_2oct_data.json...");
  let rawSource;
  try {
    rawSource = JSON.parse(fs.readFileSync(__dirname + "/bhubaneswar_2oct_data.json", "utf8"));
  } catch (err) {
    console.error("Could not read bhubaneswar_2oct_data.json", err);
    process.exit(1);
  }

  // Deep clone page_blocks
  const pageBlocks = JSON.parse(JSON.stringify(rawSource.page_blocks || {}));

  // Update specific date mentions for 3 October 2026
  if (pageBlocks.hero) {
    pageBlocks.hero.top_badge = "Open Discussion • October 3";
  }
  if (pageBlocks.workshops && pageBlocks.workshops[0]) {
    pageBlocks.workshops[0].date = "2026-10-03";
    if (pageBlocks.workshops[0].pricing) {
      pageBlocks.workshops[0].pricing.date_time_bullets = ["October 3", "2:00 PM - 6:00 PM"];
    }
  }
  if (pageBlocks.pricing_options && pageBlocks.pricing_options[0]) {
    pageBlocks.pricing_options[0].date_time_html = "<ul><li>2:00&nbsp;PM&nbsp;to&nbsp;6:00&nbsp;PM</li><li>3&nbsp;October&nbsp;2026</li></ul>";
  }
  if (pageBlocks.contact && pageBlocks.contact.lead_gen) {
    pageBlocks.contact.lead_gen.lead_source_tag = "bhubaneswar_3rd_oct";
  }

  const newEventPayload = {
    title: rawSource.title || "Chai & Conversation - Bhubaneswar",
    description: rawSource.description || "An informal discussion on Dos, Don'ts, Myths on Startup Idea Validation and Fundraising by SETU Startup School",
    venue: rawSource.venue || "Cafe in Main City, Bhubaneswar (Exact location TBD)",
    city: rawSource.city || "Bhubaneswar",
    start_date: "2026-10-03",
    start_time: rawSource.start_time || "14:00",
    end_date: "2026-10-03",
    end_time: rawSource.end_time || "18:00",
    registration_url: rawSource.registration_url || "",
    is_past: "false",
    is_pinned: "true",
    is_active: "true",
    slug: "bhubaneswar-3oct",
    banner_url: rawSource.banner_url || "https://setu-tss-uploads.s3.ap-south-1.amazonaws.com/1790608546203-cropped.jpg",
    page_blocks: JSON.stringify(pageBlocks),
  };

  console.log("\nTarget Event to Seed:");
  console.log("  Title:", newEventPayload.title);
  console.log("  Slug:", newEventPayload.slug);
  console.log("  Date:", newEventPayload.start_date, newEventPayload.start_time, "-", newEventPayload.end_time);
  console.log("  Venue:", newEventPayload.venue);
  console.log("  Banner URL:", newEventPayload.banner_url);

  // 1. Seed to PROD (foundersschool.in)
  console.log("\n=================================================");
  console.log(" [1] Seeding to Production: https://" + PROD_HOST);
  console.log("=================================================");

  try {
    const checkProd = await httpReq(PROD_HOST, 443, true, "GET", "/api/events/slug/" + newEventPayload.slug, null, null, TOKEN);
    const existingProd = checkProd.status === 200 ? checkProd.json : null;

    let resProd;
    if (existingProd && existingProd.id) {
      console.log(`  Found existing event on Prod (ID: ${existingProd.id}), updating...`);
      resProd = await postMultipart(PROD_HOST, 443, true, "/api/admin/events/" + existingProd.id, "PUT", newEventPayload, TOKEN);
    } else {
      console.log(`  Creating new event on Prod...`);
      resProd = await postMultipart(PROD_HOST, 443, true, "/api/admin/events", "POST", newEventPayload, TOKEN);
    }

    if (resProd.status === 200 || resProd.status === 201) {
      console.log(`  ✅ PROD SUCCESS (${resProd.status})`);
      const prodResult = resProd.json || {};
      console.log(`     ID  : ${prodResult.id || existingProd?.id}`);
      console.log(`     Slug: ${prodResult.slug || newEventPayload.slug}`);
      console.log(`     URL : https://${PROD_HOST}/events/${prodResult.slug || newEventPayload.slug}`);
    } else {
      console.error(`  ❌ PROD FAILED (${resProd.status}): ${resProd.body.substring(0, 300)}`);
    }
  } catch (e) {
    console.error("  ❌ PROD Network/Request Error:", e.message);
  }

  // 2. Also seed to LOCAL (localhost:5000)
  console.log("\n=================================================");
  console.log(" [2] Seeding to Localhost (http://localhost:5000)");
  console.log("=================================================");

  try {
    const checkLocal = await httpReq("localhost", 5000, false, "GET", "/api/events/slug/" + newEventPayload.slug, null, null, TOKEN);
    const existingLocal = checkLocal.status === 200 ? checkLocal.json : null;

    let resLocal;
    if (existingLocal && existingLocal.id) {
      console.log(`  Found existing event on Local (ID: ${existingLocal.id}), updating...`);
      resLocal = await postMultipart("localhost", 5000, false, "/api/admin/events/" + existingLocal.id, "PUT", newEventPayload, TOKEN);
    } else {
      console.log(`  Creating new event on Local...`);
      resLocal = await postMultipart("localhost", 5000, false, "/api/admin/events", "POST", newEventPayload, TOKEN);
    }

    if (resLocal.status === 200 || resLocal.status === 201) {
      console.log(`  ✅ LOCAL SUCCESS (${resLocal.status})`);
      const localResult = resLocal.json || {};
      console.log(`     ID  : ${localResult.id || existingLocal?.id}`);
      console.log(`     Slug: ${localResult.slug || newEventPayload.slug}`);
      console.log(`     URL : http://localhost:3000/events/${localResult.slug || newEventPayload.slug}`);
    } else {
      console.error(`  ❌ LOCAL FAILED (${resLocal.status}): ${resLocal.body.substring(0, 300)}`);
    }
  } catch (e) {
    console.error("  ❌ LOCAL Error:", e.message);
  }
}

run().catch(console.error);
