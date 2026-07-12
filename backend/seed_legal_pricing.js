const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const eventId = '917ea102-1112-4132-862c-3a3b19fb0bd6';

  const pricing_options = [
    {
      id: "opt-1",
      visible: true,
      heading: "WORKSHOP 1",
      title: "Startup Legal Foundation",
      pricing: {
        strike_price: 1500,
        actual_price: 490,
        mode: "online"
      },
      date_time_html: "<p><strong>2 Sessions (4 hours total)</strong></p><ul><li>May 25 • 6:00 PM - 8:00 PM</li><li>May 26 • 6:00 PM - 8:00 PM</li></ul>",
      key_features: "<ul><li>Entity structuring & incorporation</li><li>Founders agreements & vesting</li><li>IP protection essentials</li><li>Certificate of Participation</li></ul>",
      cta: { active: false, text: "Sold Out" },
      priority_order: 1
    },
    {
      id: "opt-2",
      visible: true,
      heading: "WORKSHOP 2",
      title: "Contracts & Compliance",
      pricing: {
        strike_price: 2000,
        actual_price: 790,
        mode: "online"
      },
      date_time_html: "<p><strong>1 Session (3 hours)</strong></p><ul><li>May 28 • 5:00 PM - 8:00 PM</li></ul>",
      key_features: "<ul><li>Drafting NDAs & Employment contracts</li><li>Vendor agreements</li><li>Regulatory compliance checklist</li><li>Certificate of Participation</li></ul>",
      cta: { active: false, text: "Sold Out" },
      priority_order: 2
    },
    {
      id: "opt-3",
      visible: true,
      heading: "EARLY BIRD OFFER",
      title: "Complete Legal Playbook (Both Workshops)",
      pricing: {
        strike_price: 3500,
        actual_price: 990,
        mode: "online"
      },
      date_time_html: "<p><strong>All 3 Sessions (7 hours)</strong></p><ul><li>May 25–28, 2026</li></ul>",
      key_features: "<ul><li>Full Access: Workshop 1 + Workshop 2</li><li>15+ Legal Templates & Drafts</li><li>1-on-1 Q&A with Legal Experts</li><li>2 Certificates of Participation</li></ul>",
      cta: { active: true, text: "Book Your Seat Now" },
      priority_order: 3
    }
  ];

  await prisma.event.update({
    where: { id: eventId },
    data: { pricing_options }
  });
  console.log("Seeded pricing options successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
