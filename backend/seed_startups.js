const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockStartups = [
  { name: "Fintech Innovators", website_url: "https://example.com/1", display_order: 1 },
  { name: "HealthAI", website_url: "https://example.com/2", display_order: 2 },
  { name: "EcoLogistics", website_url: "https://example.com/3", display_order: 3 },
  { name: "SaaS Builder", website_url: "https://example.com/4", display_order: 4 },
  { name: "Creator Economy", website_url: "https://example.com/5", display_order: 5 },
  { name: "Web3 Ventures", website_url: "https://example.com/6", display_order: 6 },
  { name: "EdTech Next", website_url: "https://example.com/7", display_order: 7 },
  { name: "AgriTech Solutions", website_url: "https://example.com/8", display_order: 8 }
];

async function seed() {
  console.log("Seeding Mentored Startups...");
  for (const startup of mockStartups) {
    await prisma.mentoredStartup.create({
      data: startup
    });
  }
  console.log("Seeded 8 startups successfully!");
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
