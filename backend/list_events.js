const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany({ select: { id: true, title: true, slug: true } });
  console.log(events);
}
main().finally(() => prisma.$disconnect());
