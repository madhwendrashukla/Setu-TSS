const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialPageData = {
    section_visibility: { hero: true, story: true, output: true, workshops: true, mentors: true, video_gallery: true, testimonials: true, faqs: true, contact: true },
    hero: { 
        headline: "Master The Art of <span class='text-purple-500'>Startup Success</span>", 
        description: "Join the most comprehensive accelerator program designed for early-stage founders to build, scale, and raise funding.", 
        key_highlights: ["3 Days", "5 Mentors", "Funding Opportunities"] 
    },
    story: { 
        visible: true, 
        headline: "Why This Program?", 
        description: "We built this program because most founders fail due to lack of guidance, not lack of effort.", 
        boxes: [
            { title: "No Fluff, Just Action", description: "Skip the theory and focus on execution.", bullets: [{ text: "Real-world case studies", style: "check" }, { text: "Boring lectures", style: "cross" }] },
            { title: "Expert Mentorship", description: "Learn from those who have done it.", bullets: [{ text: "1-on-1 Feedback", style: "check" }, { text: "Generic Advice", style: "cross" }] },
            { title: "Investor Access", description: "Get your pitch deck in front of actual investors.", bullets: [{ text: "Direct Intros", style: "check" }, { text: "Cold Emails", style: "cross" }] }
        ] 
    },
    output: { 
        image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
        headline: "By the end of this program, you will have:", 
        bullets: [
            "A polished, investor-ready pitch deck",
            "A clear go-to-market strategy",
            "A financial model that makes sense",
            "A network of fellow founders and mentors"
        ] 
    },
    workshops: [
        {
            id: "workshop_1",
            priority_order: 1,
            heading: "DAY 1",
            title: "Startup Ideation & Validation",
            key_features: "Learn how to validate your idea before spending a dime on development.",
            detail_bullets: {
                what_youll_learn: ["Customer Discovery", "Prototyping", "Market Sizing"],
                your_deliverables: ["Validation Framework", "User Persona"]
            },
            pricing: {
                strike_price: 999,
                actual_price: 499,
                date_time_bullets: ["May 15", "6:00 PM - 8:00 PM"],
                mode: "online",
                address: null
            },
            cta: { text: "Book Your Seat Now", active: true },
            visible: true
        }
    ],
    mentors: { 
        section_headline: "Meet Your Mentors", 
        items: [
            {
                id: "m1",
                image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                name: "Alex Johnson",
                professional_headline: "Ex-YC Founder | Angel Investor",
                professional_description: "Alex has built and sold two startups and now invests in early-stage SaaS companies.",
                credential_bullets: ["Founded XYZ Corp", "Invested in 50+ startups"],
                visible: true
            }
        ] 
    },
    video_gallery: { 
        headline: "Watch Our Previous Sessions", 
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"] 
    },
    testimonials: [
        {
            id: "t1",
            video_url: "",
            name: "Sarah Lee",
            role: "Founder",
            company: "TechNova",
            city: "Bangalore",
            rating: 5,
            quote: "This program completely changed how I look at my business. Highly recommended!",
            visible: true
        }
    ],
    faqs: [
        {
            id: "f1",
            priority_order: 1,
            question: "Is this program for me?",
            answer: "If you have an idea or an early-stage product, yes.",
            visible: true
        }
    ],
    contact: { 
        whatsapp: { headline: "Got Questions?", description: "Chat with our team directly.", button_text: "Message Us", link: "919876543210" }, 
        lead_gen: { headline: "Request a Callback", subtext: "Drop your details and we will call you back.", admin_email: "admin@example.com", submit_text: "Request Callback" } 
    },
    coupon: { code: "EARLYBIRD", discount_percent: 20, active: true }
};

async function main() {
  const events = await prisma.event.findMany();
  const event = events.find(e => (e.title && e.title.includes("Leagal Playbook")) || (e.slug && e.slug.includes("builder")));
  if (event) {
    await prisma.event.update({
      where: { id: event.id },
      data: {
        page_blocks: JSON.stringify(initialPageData)
      }
    });
    console.log("Successfully seeded dummy data for event:", event.title);
  } else {
    console.log("Event not found.");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
