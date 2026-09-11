const https = require("https");

const API_HOST = "foundersschool.in";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTEwMzcxMX0.DVdsBCRw3qnM44vRV6QGJL88nKYeoJTR_wU_Thq5Z00";

const testimonials = [
  { type: "text", name: "Vipin Ahuja", designation: "Founder, Vaidik Utpaad - Incubated at AIC-IIT Delhi, Winner - Sharda Launchpad", city: "", quote: "The pitch deck masterclass cleared up so many of my concepts - especially the startup metrics investors actually look for. My pitch deck improved right after. I'd rate this a solid 9.5 out of 10.", rating: "5", display_order: "10", is_active: "true", event_tag: "" },
  { type: "text", name: "Neville Duza", designation: "Founder, Snatcho", city: "", quote: "The Advanced Cohort covered valuation and term sheets in real depth. As a CS grad, there were terms I'd genuinely never learned before - now I have. Easily a 9 out of 10.", rating: "5", display_order: "11", is_active: "true", event_tag: "" },
  { type: "text", name: "Dhiviga Kathir", designation: "Director, Kadaikodi Tech", city: "", quote: "This was my first time in the startup ecosystem, and it gave me real clarity on capital, how to approach investors, and how to sharpen my pitch. Genuinely helpful from start to finish.", rating: "5", display_order: "12", is_active: "true", event_tag: "" },
  { type: "text", name: "Akanksha Bajaj", designation: "Founder, Her Upstart Studio (UK)", city: "", quote: "They opened with Airbnb's actual pitch deck - simple, inspiring storytelling - then gave us access to 80+ real pitch decks plus detailed valuation and equity calculations. The hosts were humble and sharp. I'd rate it a 9.5 out of 10.", rating: "5", display_order: "13", is_active: "true", event_tag: "" },
  { type: "text", name: "Dakshita Tyagi", designation: "Workshop Participant", city: "", quote: "Short, condensed, and packed with value - a great trainer, and the flow and conversation throughout the session were absolutely great.", rating: "5", display_order: "14", is_active: "true", event_tag: "" },
  { type: "text", name: "Utpal Ravi", designation: "Flyo.ai", city: "", quote: "The kind of depth that only comes from real experience. It cut short our entire research journey - different tools, real use cases, no fluff.", rating: "4", display_order: "15", is_active: "true", event_tag: "" },
  { type: "text", name: "Abhishek", designation: "Workshop Participant", city: "", quote: "He broke the problem down into its fundamental blocks, then showed exactly how to build a storyline, pick the right tools, and walk away with an actual working final product.", rating: "4", display_order: "16", is_active: "true", event_tag: "" }
];

function postForm(path, fields) {
  return new Promise((resolve, reject) => {
    const boundary = "----Boundary" + Date.now();
    let body = "";
    for (const [k, v] of Object.entries(fields)) {
      body += "--" + boundary + "\r\n";
      body += "Content-Disposition: form-data; name=\"" + k + "\"\r\n\r\n";
      body += v + "\r\n";
    }
    body += "--" + boundary + "--\r\n";
    const buf = Buffer.from(body, "utf8");

    const options = {
      hostname: API_HOST,
      port: 443,
      path,
      method: "POST",
      headers: {
        "Authorization": "Bearer " + TOKEN,
        "Content-Type": "multipart/form-data; boundary=" + boundary,
        "Content-Length": buf.length
      }
    };

    const req = https.request(options, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.write(buf);
    req.end();
  });
}

// Test with first one first to see exact error
async function main() {
  console.log("Testing with first testimonial to see full error...\n");
  const t = testimonials[0];
  const res = await postForm("/api/admin/testimonials", t);
  console.log("Status:", res.status);
  console.log("Response:", res.body);
}

main().catch(console.error);
