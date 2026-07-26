const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Updating HomepageContent with formatted HTML...");
  
  const content = await prisma.homepageContent.findFirst();
  if (content) {
    await prisma.homepageContent.update({
      where: { id: content.id },
      data: {
        hero_heading: 'Stop Ideating.<br />Start <span class="text-accent-violet">Building.</span>',
        hero_tagline: 'Join the alternate B-school for Aspiring Founders.',
        hero_scene1_heading: '<span class="text-xs md:text-sm font-bold tracking-[0.2em] text-accent-violet uppercase mb-4 block">THE BRIDGE</span>The 0 &rarr; 1 Bridge<br />Where Founders Are Built.',
        hero_scene1_tagline: 'We close 4 deadly gaps: Learning, Access, Mentoring, Community',
        hero_scene2_heading: '<span class="text-xs md:text-sm font-bold tracking-[0.2em] text-accent-violet uppercase mb-4 block">THE ROADMAP</span>3 days of ignition sprint<br /><span class="text-text-secondary text-2xl md:text-3xl block my-2">to</span><span class="text-accent-violet">100 days of Deep Dive Immersion cohorts</span>',
        hero_scene2_tagline: '<i class="font-normal">Choose the program that fits you the best</i>',
        hero_rotation_seconds: 4
      }
    });
    console.log("HomepageContent updated.");
  } else {
    await prisma.homepageContent.create({
      data: {
        hero_heading: 'Stop Ideating.<br />Start <span class="text-accent-violet">Building.</span>',
        hero_tagline: 'Join the alternate B-school for Aspiring Founders.',
        hero_scene1_heading: '<span class="text-xs md:text-sm font-bold tracking-[0.2em] text-accent-violet uppercase mb-4 block">THE BRIDGE</span>The 0 &rarr; 1 Bridge<br />Where Founders Are Built.',
        hero_scene1_tagline: 'We close 4 deadly gaps: Learning, Access, Mentoring, Community',
        hero_scene2_heading: '<span class="text-xs md:text-sm font-bold tracking-[0.2em] text-accent-violet uppercase mb-4 block">THE ROADMAP</span>3 days of ignition sprint<br /><span class="text-text-secondary text-2xl md:text-3xl block my-2">to</span><span class="text-accent-violet">100 days of Deep Dive Immersion cohorts</span>',
        hero_scene2_tagline: '<i class="font-normal">Choose the program that fits you the best</i>',
        hero_rotation_seconds: 4
      }
    });
    console.log("HomepageContent created.");
  }

  console.log("Clearing old HeroSlides...");
  await prisma.heroSlide.deleteMany();

  console.log("Inserting 6 new HeroSlides...");
  const slidesToInsert = [
    '/images/hero-bg/slide-2.png',
    '/images/hero-bg/slide-3.png',
    '/images/hero-bg/slide-4.png',
    '/images/hero-bg/slide-5.png',
    '/images/hero-bg/slide-6.png',
    '/images/hero-bg/slide-7.png',
  ];

  for (let i = 0; i < slidesToInsert.length; i++) {
    await prisma.heroSlide.create({
      data: {
        image_url: slidesToInsert[i],
        display_order: i + 1,
        is_active: true
      }
    });
  }
  console.log("HeroSlides inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
