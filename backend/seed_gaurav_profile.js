/**
 * seed_gaurav_profile.js
 *
 * Seeds the gaurav_profile table with Gaurav Bansal's current profile data.
 * Run ONCE after `npx prisma db push` creates the table.
 *
 * Usage:
 *   node seed_gaurav_profile.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.gauravProfile.findFirst();
  if (existing) {
    console.log('✅ gaurav_profile row already exists — skipping seed.');
    console.log('   id:', existing.id);
    return;
  }

  const profile = await prisma.gauravProfile.create({
    data: {
      name: 'Gaurav Bansal',
      tagline: "Building Bharat's Launchpad for next generation of Entrepreneurs",
      photo_url: '/gaurav.jpg',
      org: 'Setu - TheStartupSchool',
      title: 'Founder',
      phone: '+919289121121',
      email: 'Gauravbansal@foundersschool.in',
      website: 'https://setustartupschool.com',
      address: 'Malad West, Mumbai',
      vcard_filename: 'Gaurav_Bansal',
      ecosystem_links: [
        {
          id: randomUUID(),
          label: 'Visit Website',
          sublabel: 'setustartupschool.com',
          url: 'https://setustartupschool.com',
          icon: 'fas fa-globe',
          style: 'primary',
          color: 'violet',
          display_order: 0,
          is_active: true,
        },
        {
          id: randomUUID(),
          label: 'Setu - TheStartupSchool LinkedIn',
          sublabel: '',
          url: 'https://www.linkedin.com/company/the-startup-school-2026/',
          icon: 'fab fa-linkedin',
          style: 'glass',
          color: 'blue',
          display_order: 1,
          is_active: true,
        },
        {
          id: randomUUID(),
          label: 'Follow our Instagram',
          sublabel: '',
          url: 'https://www.instagram.com/the__startup__school',
          icon: 'fab fa-instagram',
          style: 'glass',
          color: 'pink',
          display_order: 2,
          is_active: true,
        },
      ],
      founder_links: [
        {
          id: randomUUID(),
          label: 'Connect with Gaurav',
          sublabel: '',
          url: 'https://www.linkedin.com/in/gauravbansal2/',
          icon: 'fab fa-linkedin-in',
          style: 'glass',
          color: 'white',
          display_order: 0,
          is_active: true,
        },
        {
          id: randomUUID(),
          label: "Founder's Hacks",
          sublabel: 'Masterclass Video',
          url: 'https://www.youtube.com/watch?v=tt_PVE_A3wU',
          icon: 'fab fa-youtube',
          style: 'glass',
          color: 'red',
          display_order: 1,
          is_active: true,
        },
      ],
      footer_brand_name: 'THE STARTUP SCHOOL',
      footer_tagline: 'An alternate B-School for all Aspiring Founders',
    },
  });

  console.log('✅ Seeded gaurav_profile successfully. id:', profile.id);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
