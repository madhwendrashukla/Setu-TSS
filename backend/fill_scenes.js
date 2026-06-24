const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.homepageContent.findFirst();
  if (existing) {
    await prisma.homepageContent.update({
      where: { id: existing.id },
      data: {
        hero_scene1_heading: "The 0 -> 1 Bridge\nWhere Founders Are Built.",
        hero_scene1_tagline: "We close 4 deadly gaps: Learning, Access, Mentoring, Community",
        hero_scene2_heading: "3 days of ignition sprint\nto\n100 days of Deep Dive Immersion cohorts",
        hero_scene2_tagline: "Choose the program that fits you the best"
      }
    });
    console.log("Updated existing homepage content");
  } else {
    console.log("No homepage content found");
  }
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
