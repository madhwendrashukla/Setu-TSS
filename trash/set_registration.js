const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.event.update({
        where: { slug: 'claude-workshop-dummy' },
        data: {
            is_past: false,
            registration_url: 'https://foundersschool.in/register'
        }
    });
    console.log('Event updated to allow registration');
}
main().finally(() => prisma.$disconnect());
