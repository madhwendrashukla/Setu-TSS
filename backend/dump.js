const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const e = await prisma.event.findFirst({
    where: { 
      slug: {
        contains: 'ai'
      }
    }
  });
  if (e) {
    fs.writeFileSync('ai_blocks.json', typeof e.page_blocks === 'string' ? e.page_blocks : JSON.stringify(e.page_blocks, null, 2));
    console.log("Dumped to ai_blocks.json from event:", e.slug);
  } else {
    console.log("No AI event found");
  }
}
main().finally(() => prisma.$disconnect());
