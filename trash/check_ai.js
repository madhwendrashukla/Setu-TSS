const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ai = await prisma.event.findUnique({where: {id: 'dfa47cd2-d36a-4634-afdf-f09bf4e1c2c3'}});
  console.log("type of page_blocks:", typeof ai.page_blocks);
  console.log("value preview:", JSON.stringify(ai.page_blocks).substring(0, 500));
}
main().finally(() => { prisma.$disconnect(); });
