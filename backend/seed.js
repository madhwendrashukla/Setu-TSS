const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thestartupschool.in' },
    update: {},
    create: {
      email: 'admin@thestartupschool.in',
      password: 'password123',
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
