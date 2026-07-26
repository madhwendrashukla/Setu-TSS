const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany();
  events.forEach(e => {
    let pb;
    try {
      pb = typeof e.page_blocks === 'string' ? JSON.parse(e.page_blocks) : e.page_blocks;
    } catch(err) {
      pb = {};
    }
    const tags = [];
    if (Array.isArray(pb)) {
      // old format
      pb.forEach(block => {
        if (block.type === 'contact') {
          tags.push(block.data?.lead_gen?.lead_source_tag);
        }
      });
    } else {
      tags.push(pb?.contact?.lead_gen?.lead_source_tag);
    }
    console.log(`Event: ${e.title} - Source Tag: ${JSON.stringify(tags)}`);
  });
}

main().finally(() => prisma.$disconnect());
