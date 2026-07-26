const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) throw new Error('ADMIN_PASSWORD is required in .env — seed aborted');
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thestartupschool.in' },
    update: {},
    create: {
      email: 'admin@thestartupschool.in',
      password: hashedPassword,
    },
  });
  console.log('Created Admin User:', admin.email);

  // Seed Homepage Content
  await prisma.homepageContent.create({
    data: {
      hero_heading: 'Stop Ideating. Start Building.',
      hero_tagline: 'Bridging the 4 deadly gaps of Learning, Access, Mentoring, and Community.',
      hero_rotation_seconds: 5
    }
  });
  console.log('Seeded Homepage Content');

  // Seed Site Settings
  await prisma.siteSetting.create({
    data: {
      address: '123 Startup Ave, Innovation City',
      contact_email: 'hello@thestartupschool.in',
      contact_phone: '+91 98765 43210',
      certifications: '[]'
    }
  });
  console.log('Seeded Site Settings');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
