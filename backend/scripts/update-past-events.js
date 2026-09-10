require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PAST_EVENTS } = require('./seed-past-events-data');
const prisma = new PrismaClient();
(async () => {
  for (const ev of PAST_EVENTS) {
    const updated = await prisma.event.update({
      where: { slug: ev.slug },
      data: { page_blocks: ev.page_blocks, title: ev.title, description: ev.description }
    });
    console.log('Updated:', updated.slug);
  }
  await prisma.$disconnect();
  console.log('Done.');
})().catch(async e => { console.error(e.message); await prisma.$disconnect(); process.exit(1); });
