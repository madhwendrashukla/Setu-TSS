const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dummyData = {
  section_visibility: {
    hero: true,
    story: true,
    output: true,
    workshops: true,
    pricing: true,
    mentors: true,
    video_gallery: true,
    text_testimonials: true,
    video_testimonials: true,
    faqs: true,
    contact: true
  },
  workshops: [
    {
      id: "w_1",
      priority_order: 1,
      heading: "DAY 1",
      title: "Mastering the Legal Basics",
      key_features: "Understand the foundational legal requirements for starting a business in India.",
      detail_bullets: {
        what_youll_learn: ["Company Incorporation Types", "Founder Agreements", "Basic Tax Registration (GST, PAN)"],
        your_deliverables: ["Incorporation Checklist", "Draft Founder Agreement Template"]
      },
      visible: true
    },
    {
      id: "w_2",
      priority_order: 2,
      heading: "DAY 2",
      title: "Contracts & IP Protection",
      key_features: "Learn how to protect your brand and sign deals safely.",
      detail_bullets: {
        what_youll_learn: ["NDA & Vendor Contracts", "Trademark & Copyright filing", "Employment Agreements"],
        your_deliverables: ["Standard NDA Template", "IP Assignment Agreement"]
      },
      visible: true
    }
  ],
  pricing_options: [
    {
      id: "p_1",
      priority_order: 1,
      heading: "ONLINE PASS",
      title: "Virtual Access",
      key_features: "Get access to live streams and digital resources.",
      pricing: {
        strike_price: 2999,
        actual_price: 999,
        date_time_bullets: ["August 10-11, 2026", "2:00 PM - 6:00 PM IST"],
        mode: "online"
      },
      cta: {
        text: "Book Virtual Pass",
        active: true
      },
      visible: true
    },
    {
      id: "p_2",
      priority_order: 2,
      heading: "VIP OFFLINE",
      title: "In-Person Masterclass",
      key_features: "Join us in Mumbai for an exclusive offline networking & learning experience.",
      pricing: {
        strike_price: 9999,
        actual_price: 4999,
        date_time_bullets: ["August 10-11, 2026", "10:00 AM - 6:00 PM IST"],
        mode: "offline",
        address: "Spotlight, Andheri, Mumbai"
      },
      cta: {
        text: "Book VIP Seat",
        active: true
      },
      visible: true
    }
  ],
  mentors: {
    section_headline: "Learn from Industry Experts",
    items: [
      {
        name: "Adv. Rahul Sharma",
        title: "Corporate Lawyer",
        bio: "Over 10 years of experience advising startups on legal structure and funding.",
        photo_url: "https://i.pravatar.cc/300?img=11",
        linkedin_url: "https://linkedin.com",
        visible: true
      },
      {
        name: "Priya Desai",
        title: "IP Strategy Head",
        bio: "Specializes in patents, trademarks, and copyright law for deep-tech companies.",
        photo_url: "https://i.pravatar.cc/300?img=47",
        linkedin_url: "https://linkedin.com",
        visible: true
      }
    ]
  },
  hero: {
    headline: "The Ultimate Legal Playbook for Founders",
    description: "Navigate the complex Indian legal landscape with confidence. A 2-day intensive masterclass.",
    key_highlights: ["2 Days of Intensive Learning", "Expert Legal Mentors", "Ready-to-use Templates"]
  },
  story: {
    headline: "Why you need this Playbook",
    description: "Most startups fail due to poor legal structuring. Don't be a statistic.",
    boxes: [
      { title: "Compliance", description: "Stay on the right side of the law." },
      { title: "Protection", description: "Secure your IP before it's stolen." }
    ]
  },
  output: {
    headline: "What you walk away with",
    bullets: ["Ironclad founder agreements", "Complete compliance roadmap", "Fundraising legal readiness"]
  },
  video_gallery: {
    headline: "Glimpses from past workshops",
    videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
  },
  text_testimonials: [
    {
      name: "Amit Patel",
      designation: "Founder, Techify",
      quote: "This workshop saved me from a massive legal blunder with my co-founder.",
      photo_url: "https://i.pravatar.cc/300?img=12",
      rating: 5,
      visible: true
    }
  ],
  video_testimonials: [
    {
      name: "Sneha Rao",
      designation: "CEO, Innovate",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      quote: "Highly recommend for early-stage founders.",
      visible: true
    }
  ],
  faqs: [
    { question: "Is this suitable for non-tech founders?", answer: "Absolutely. The legal principles apply to all businesses.", visible: true },
    { question: "Will we get 1-on-1 time?", answer: "VIP offline attendees will have a dedicated Q&A networking session.", visible: true }
  ],
  contact: {
    whatsapp: { headline: "Got Questions?", description: "Chat with our support team", button_text: "WhatsApp Us", link: "https://wa.me/1234567890" },
    lead_gen: { headline: "Request a callback", subtext: "Drop your details below", submit_text: "Call Me Back" }
  }
};

async function seed() {
  try {
    const event = await prisma.event.findFirst({
      where: { slug: "builder" }
    });

    if (!event) {
      console.log("Event with slug 'builder' not found!");
      return;
    }

    await prisma.event.update({
      where: { id: event.id },
      data: {
        page_blocks: dummyData
      }
    });

    console.log("Successfully seeded dummy data for event:", event.title);
  } catch (error) {
    console.error("Error seeding dummy data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
