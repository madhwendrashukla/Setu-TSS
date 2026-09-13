// One-time script: Set existing admin accounts that have no admin_type to 'primary'.
// Run once after deploying the multi-admin schema change.
// Usage: node scripts/set-primary-admins.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { role: 'admin', admin_type: null },
    data: { admin_type: 'primary' }
  });
  console.log(`Updated ${result.count} existing admin(s) to admin_type='primary'`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
