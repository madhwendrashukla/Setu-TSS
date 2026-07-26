const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pastEvents = [
    {
      title: "Founder's Dating",
      slug: "founders-dating-14feb26",
      description: "A curated offline meetup for founders & builders. We skipped the awkward small talk, facilitated expert matchmaking, and ran rigorous breakout sessions to help builders find their exact business soulmates.",
      venue: "DevX, Andheri East",
      start_date: new Date("2026-02-14"),
      end_date: new Date("2026-02-14"),
      is_past: true,
      is_pinned: false
    },
    {
      title: "Capital / Fund-Raising Workshop",
      slug: "fundraising-workshop-15apr",
      description: "Stop guessing what investors want. A live, cohort-based program that transformed passionate builders into investable founders.",
      venue: "Live Cohort (Online)",
      start_date: new Date("2026-04-15"),
      end_date: new Date("2026-04-15"),
      is_past: true,
      is_pinned: false
    },
    {
      title: "AI Startup Launchpad",
      slug: "ai-workshop-15may",
      description: "Build, Validate & Launch Your Startup in 3 Days. Master ideation methods, build AI-powered MVPs, and create marketing films — live with top mentors.",
      venue: "Live Cohort (Online)",
      start_date: new Date("2026-05-15"),
      end_date: new Date("2026-05-17"),
      is_past: true,
      is_pinned: false
    }
  ];

  for (const event of pastEvents) {
    // Upsert based on slug so we don't accidentally duplicate if run twice
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: event,
      create: event
    });
  }

  console.log("Successfully seeded 3 past events!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
