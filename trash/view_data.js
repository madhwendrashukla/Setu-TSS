const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const latestUsers = await prisma.user.findMany({
    include: {
      registrations: true
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 1
  });

  console.log("=== Latest User ===");
  console.log(JSON.stringify(latestUsers, null, 2));

  const allRegistrations = await prisma.eventRegistration.findMany({
    orderBy: {
      created_at: 'desc'
    },
    take: 5
  });

  console.log("\n=== Latest Registrations ===");
  console.log(JSON.stringify(allRegistrations, null, 2));
}

main().finally(() => prisma.$disconnect());
