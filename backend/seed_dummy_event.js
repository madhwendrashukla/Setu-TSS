const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dummyBlocks = [
    {
      type: "hero",
      data: {
        title: "AI Entrepreneurship Workshop Series",
        subtitle: "Build, Validate & Launch Your Startup in 3 Days.",
        buttonText: "Secure Your Seat",
        buttonLink: "#pricing"
      }
    },

    {
      type: "storyline",
      data: {
        title: "The Entrepreneur's Journey",
        subtitle: "How you will evolve over the 3 days",
        stories: [
          { heading: "Day 1: Ideation", body: "Discover and validate a billion-dollar idea using AI frameworks.", color: "#8b5cf6", highlight: true },
          { heading: "Day 2: Execution", body: "Build your fully functional MVP without writing a single line of code manually.", color: "#d946ef", highlight: true },
          { heading: "Day 3: Launch", body: "Deploy your app to the world and get your first 100 paying customers.", color: "#ec4899", highlight: true }
        ]
      }
    },
    {
      type: "curriculum",
      data: {
        title: "What You'll Learn",
        tracks: [
          {
            trackTitle: "Module 1: Advanced Prompt Engineering",
            targetAudience: "Founders & Builders",
            topics: [
              "Understanding LLM Architecture",
              "Zero-shot vs Few-shot Prompting",
              "System Prompts for complex apps"
            ]
          },
          {
            trackTitle: "Module 2: AI App Development",
            targetAudience: "Non-technical founders",
            topics: [
              "Setting up your dev environment",
              "Generating React & Next.js components",
              "Integrating databases automatically"
            ]
          }
        ]
      }
    },
    {
      type: "outcomes",
      data: {
        deliverablesTitle: "Your Toolkit",
        deliverables: [
          { icon: "fa-rocket", title: "Deployed MVP", desc: "A live web application ready for users.", color: "#8b5cf6" },
          { icon: "fa-file-lines", title: "Prompt Library", desc: "50+ tested prompts for building apps.", color: "#d946ef" },
          { icon: "fa-video", title: "Marketing Assets", desc: "AI-generated videos and copy.", color: "#ec4899" }
        ],
        audienceTitle: "Who is this for?",
        audience: [
          { icon: "fa-user-tie", label: "Founders", desc: "Build your product faster." },
          { icon: "fa-laptop-code", label: "Developers", desc: "10x your coding speed." }
        ],
        whyItWorksTitle: "Why Our System Works",
        whyItWorks: [
          { icon: "fa-brain", title: "Action-Oriented", points: ["No fluff", "Build alongside mentors"] }
        ]
      }
    },
    {
      type: "pricing",
      data: {
        title: "Choose Your Path",
        subtitle: "Pick the plan that fits you best",
        bannerMessage: "🔥 Only 5 spots left in the Pro tier!",
        plans: [
          {
            level: "Tier 1",
            name: "Basic",
            mentor: "Atul Pandey",
            originalPrice: "₹1,999",
            earlyBird: "₹999",
            sessions: "Live sessions",
            date: "May 15-17",
            color: "#8b5cf6",
            includes: ["Live sessions", "Q&A support", "Community access"],
            razorpayLink: "#"
          },
          {
            level: "Tier 2",
            name: "Intermediate",
            mentor: "Gaurav Bansal",
            originalPrice: "₹3,999",
            earlyBird: "₹1,999",
            sessions: "Live sessions + 1-on-1",
            date: "May 15-17",
            color: "#d946ef",
            isFeatured: true,
            saveBadge: "Save ₹2,000",
            includes: ["Everything in Basic", "1-on-1 Mentorship", "Resource templates"],
            razorpayLink: "#"
          },
          {
            level: "Tier 3",
            name: "Pro",
            mentor: "Amey Asuti",
            originalPrice: "₹6,999",
            earlyBird: "₹3,499",
            sessions: "Lifetime Access",
            date: "May 15-17",
            color: "#ec4899",
            includes: ["Everything in Intermediate", "Done-for-you prompts", "Lifetime access to recordings"],
            razorpayLink: "#"
          }
        ]
      }
    },
    {
      type: "mentors",
      data: {
        title: "Meet Your Mentors",
        subtitle: "Learn from industry experts",
        mentorsList: [
          {
            name: "Atul Pandey",
            role: "AI Expert",
            bio: "Building with LLMs for 3+ years.",
            workshop: "Claude Pro",
            color: "#d946ef",
            image: "/mentors/atul.webp",
            imagePosition: "center top",
            credentials: [
              { icon: "fa-certificate", text: "Certified Claude Developer" },
              { icon: "fa-users", text: "Trained 500+ students" }
            ],
            quote: "AI is the ultimate lever for founders."
          },
          {
            name: "Gaurav Bansal",
            role: "Startup Mentor",
            bio: "Helped 100+ startups ideate.",
            workshop: "Startup Ideation",
            color: "#8b5cf6",
            image: "/mentors/gaurav.webp",
            imagePosition: "center",
            credentials: [
              { icon: "fa-rocket", text: "Launched 10+ startups" },
              { icon: "fa-chart-line", text: "$5M+ raised by mentees" }
            ]
          },
          {
            name: "Amey Asuti",
            role: "Video Marketer",
            bio: "Award-winning filmmaker.",
            workshop: "AI Filmmaking",
            color: "#ec4899",
            image: "/mentors/amey.webp",
            imagePosition: "center",
            credentials: [
              { icon: "fa-video", text: "100+ viral videos" },
              { icon: "fa-eye", text: "10M+ views" }
            ]
          }
        ]
      }
    },
    {
      type: "testimonials",
      data: {
        title: "What Alumni Say",
        subtitle: "Hear from founders who've taken our programs.",
        reviews: [
          {
            name: "Rahul S.",
            role: "Founder, TechAI",
            location: "Bangalore",
            workshopTag: "AI Workshop",
            tagColor: "#8b5cf6",
            quote: "This workshop completely changed how I build. I launched my MVP in 3 days.",
            avatar: "/logo.png",
            rating: 5,
            duration: "2:30",
            youtubeId: "",
            videoLabel: "Watch Rahul's Story"
          },
          {
            name: "Sneha M.",
            role: "Product Manager",
            location: "Delhi",
            workshopTag: "Product Masterclass",
            tagColor: "#d946ef",
            quote: "The mentors are incredibly knowledgeable. Worth every penny.",
            avatar: "/logo.png",
            rating: 5,
            duration: "1:45",
            youtubeId: "",
            videoLabel: "Watch Sneha's Story"
          }
        ]
      }
    },
    {
      type: "schedule",
      data: {
        title: "Workshop Schedule",
        subtitle: "3 Days of Intense Learning",
        days: [
          {
            day: "Day 1 (Friday)",
            date: "May 15th",
            sessions: [
              { 
                time: "6:00 PM - 7:00 PM", 
                title: "Intro to AI & Prompt Engineering",
                mentor: "Atul Pandey",
                icon: "fa-robot",
                color: "#d946ef"
              },
              { 
                time: "7:00 PM - 9:00 PM", 
                title: "Startup Ideation Frameworks",
                mentor: "Gaurav Bansal",
                icon: "fa-lightbulb",
                color: "#8b5cf6"
              }
            ]
          },
          {
            day: "Day 2 (Saturday)",
            date: "May 16th",
            sessions: [
              { 
                time: "10:00 AM - 1:00 PM", 
                title: "Building with Claude Pro (Part 1)",
                mentor: "Atul Pandey",
                icon: "fa-code",
                color: "#d946ef"
              },
              { 
                time: "2:00 PM - 5:00 PM", 
                title: "Building with Claude Pro (Part 2)",
                mentor: "Atul Pandey",
                icon: "fa-server",
                color: "#d946ef"
              }
            ]
          },
          {
            day: "Day 3 (Sunday)",
            date: "May 17th",
            sessions: [
              { 
                time: "10:00 AM - 12:00 PM", 
                title: "AI Filmmaking & Marketing",
                mentor: "Amey Asuti",
                icon: "fa-video",
                color: "#ec4899"
              },
              { 
                time: "12:00 PM - 2:00 PM", 
                title: "Showcase & Feedback",
                mentor: "Gaurav Bansal",
                icon: "fa-comments",
                color: "#8b5cf6"
              }
            ]
          }
        ]
      }
    },
    {
      type: "faq",
      data: {
        title: "Frequently Asked Questions",
        faqs: [
          {
            question: "Do I need coding experience?",
            answer: "No! We'll teach you how to use AI to write the code for you."
          },
          {
            question: "Will the sessions be recorded?",
            answer: "Yes, Pro users get lifetime access to the recordings."
          },
          {
            question: "What tools do I need?",
            answer: "Just a laptop, an internet connection, and a Claude Pro subscription."
          }
        ]
      }
    }
  ];

  // Update existing dummy event or create it
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "claude-workshop-dummy" }
  });

  if (existingEvent) {
    const updated = await prisma.event.update({
      where: { slug: "claude-workshop-dummy" },
      data: {
        page_blocks: dummyBlocks
      }
    });
    console.log("Successfully updated dummy event:", updated.slug);
  } else {
    const newEvent = await prisma.event.create({
      data: {
        title: "AI Workshop (Dummy Full)",
        description: "A complete dummy workshop mimicking the AI Workshop.",
        slug: "claude-workshop-dummy",
        start_date: new Date(),
        end_date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // +3 days
        registration_url: "https://example.com/register",
        page_blocks: dummyBlocks,
      }
    });
    console.log("Successfully created dummy event:", newEvent.slug);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
