const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.promoBar.create({
        data: {
            title: "🔥 Special Offer: Setu AI Masterclass",
            button_text: "Claim Your Spot",
            button_link: "/register",
            price_text: "₹1999|at just ₹1299",
            subtext: "Offer ends in TIMER:5",
            is_active: true
        }
    });
    console.log("Promo bar seeded");
}

main().catch(console.error).finally(() => prisma.$disconnect());
