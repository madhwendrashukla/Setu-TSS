const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const testimonials = [
  {
    type: "text",
    name: "Vipin Ahuja",
    designation: "Founder, Vaidik Utpaad · Incubated at AIC-IIT Delhi, Winner – Sharda Launchpad",
    city: "",
    quote: "The pitch deck masterclass cleared up so many of my concepts — especially the startup metrics investors actually look for. My pitch deck improved right after. I'd rate this a solid 9.5 out of 10.",
    rating: 5,
    display_order: 10,
    is_active: true
  },
  {
    type: "text",
    name: "Neville Duza",
    designation: "Founder, Snatcho",
    city: "",
    quote: "The Advanced Cohort covered valuation and term sheets in real depth. As a CS grad, there were terms I'd genuinely never learned before — now I have. Easily a 9 out of 10.",
    rating: 5,
    display_order: 11,
    is_active: true
  },
  {
    type: "text",
    name: "Dhiviga Kathir",
    designation: "Director, Kadaikodi Tech",
    city: "",
    quote: "This was my first time in the startup ecosystem, and it gave me real clarity on capital, how to approach investors, and how to sharpen my pitch. Genuinely helpful from start to finish.",
    rating: 5,
    display_order: 12,
    is_active: true
  },
  {
    type: "text",
    name: "Akanksha Bajaj",
    designation: "Founder, Her Upstart Studio (UK)",
    city: "",
    quote: "They opened with Airbnb's actual pitch deck — simple, inspiring storytelling — then gave us access to 80+ real pitch decks plus detailed valuation and equity calculations. The hosts were humble and sharp. I'd rate it a 9.5 out of 10.",
    rating: 5,
    display_order: 13,
    is_active: true
  },
  {
    type: "text",
    name: "Dakshita Tyagi",
    designation: "Workshop Participant",
    city: "",
    quote: "Short, condensed, and packed with value — a great trainer, and the flow and conversation throughout the session were absolutely great.",
    rating: 5,
    display_order: 14,
    is_active: true
  },
  {
    type: "text",
    name: "Utpal Ravi",
    designation: "Flyo.ai",
    city: "",
    quote: "The kind of depth that only comes from real experience. It cut short our entire research journey — different tools, real use cases, no fluff.",
    rating: 4,
    display_order: 15,
    is_active: true
  },
  {
    type: "text",
    name: "Abhishek",
    designation: "Workshop Participant",
    city: "",
    quote: "He broke the problem down into its fundamental blocks, then showed exactly how to build a storyline, pick the right tools, and walk away with an actual working final product.",
    rating: 4,
    display_order: 16,
    is_active: true
  }
];

async function seed() {
  for (const t of testimonials) {
    const r = await prisma.testimonial.create({ data: t });
    console.log("Created:", r.name, "|", r.id);
  }
  console.log("All 7 testimonials seeded!");
  await prisma.$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
