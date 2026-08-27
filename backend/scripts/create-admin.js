const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@thestartupschool.in';   // matches the existing seeded admin row
  const passwordHash = await bcrypt.hash('admin', 10);
  
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: passwordHash,
      role: 'admin'
    },
    create: {
      email,
      name: 'Admin',
      password: passwordHash,
      role: 'admin'
    }
  });

  console.log('Admin user created successfully:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
