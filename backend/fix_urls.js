const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.$executeRaw`UPDATE tss_events SET registration_url = '' WHERE registration_url IS NULL`;
  console.log('Updated');
}
run().finally(() => prisma.$disconnect());
