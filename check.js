const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.event.findFirst({ where: { slug: 'builder' } }).then(e => console.log(JSON.stringify(e?.page_blocks?.contact, null, 2))).finally(() => prisma.$disconnect());
