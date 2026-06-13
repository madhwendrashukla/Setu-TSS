const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mentorsData = [
    {
        name: "Vikram Anand Bhushan",
        title: "Co-Founder, Hypermine",
        bio: "Founder with 11+ years of experience scaling blockchain venture, currently building privacy-first digital trust infrastructure through Hypermine.",
        photo_url: "/vikrambanand.webp",
        linkedin_url: "https://www.linkedin.com/in/vikrambanand/?originalSubdomain=ae",
        display_order: 1
    },
    {
        name: "Ashish Kulkarni",
        title: "Founder, Founders' Psyche",
        bio: "Ex-CoFounder - FundEnable, MBA-IE Business School-Spain. Ex-Research Assistant - INSEAD, France. Brings strong experience of building startups and raising funds.",
        photo_url: "/Ashish_kulkarni.webp",
        linkedin_url: "https://www.linkedin.com/in/ashishkul/",
        display_order: 2
    },
    {
        name: "Vaibhav Bhargava",
        title: "Salesforce Architect",
        bio: "Salesforce Architect at JLL with 15+ years of experience across JLL, PwC, PTC, and Amdocs, leading enterprise Salesforce architecture and digital transformation initiatives.",
        photo_url: "/vaibhav_bhargava.webp",
        linkedin_url: "https://www.linkedin.com/in/vaibhav-bhargava-0a1364a/",
        display_order: 3
    },
    {
        name: "Harsh Gupta",
        title: "PhD, Quantum Error Correction",
        bio: "Ph.D. scholar at IISER, Bhopal researching Quantum Error Correction in Measurement-Based Quantum Computing. M.Tech from NIT-Srinagar, prior industry experience at Infosys.",
        photo_url: "/harsh_gupta.webp",
        linkedin_url: "https://www.linkedin.com/in/harsh-gupta-aa3bbb99/",
        display_order: 4
    },
    {
        name: "Pavan Agarwal",
        title: "Founder, DD Cinemas",
        bio: "'The Cinema Man of UP-East.' Founder of DD Cinema, currently operating 30+ multiplex screens with a strategic expansion to 50+ screens by the end of 2026.",
        photo_url: "/pavan_dd.webp",
        linkedin_url: "https://www.linkedin.com/in/pavan-agarwal-8353092/",
        display_order: 5
    },
    {
        name: "CA Moon Goel",
        title: "CA, Co-Founder - Vitt Kushal",
        bio: "20+ yrs work-ex in forensic accounting, internal audit, compliance, and tax advisory. Expertise in guiding startups for financial forecasting, valuation and cap table management.",
        photo_url: "/moongoel.webp",
        linkedin_url: "https://www.linkedin.com/in/moongoel/",
        display_order: 6
    },
    {
        name: "CA Mahendra Tiwari",
        title: "CA, Partner",
        bio: "20+ yrs of work ex with expertise in startup valuation, Small Business Tax Preparation, Bookkeeping and Accounting.",
        photo_url: "/mahendra.webp",
        linkedin_url: "https://www.linkedin.com/in/mahendra-tiwari-4a62b112/",
        display_order: 7
    },
    {
        name: "Akash Kansal",
        title: "Founder, Author",
        bio: "A FMS-Delhi passout, he brings with him 12+ yrs of expereince in building products , strategy at organisations like 99acre, Droom, Deloitte. His book 'The class of 2006' was launched by R.Madhavan. Currently building next Gen AI Products in B2B SAAS.",
        photo_url: "/akash.webp",
        linkedin_url: "https://www.linkedin.com/in/akashkansal/",
        display_order: 8
    },
    {
        name: "Deric Karunesudas",
        title: "Cybersecurity Leader & Investor",
        bio: "A Cybersecurity Leader and seasoned Investor with an 18-year track record of driving profitable growth for global enterprises. Spanning the US, Europe, Middle East, and APAC.",
        photo_url: "/deric.webp",
        linkedin_url: "https://www.linkedin.com/in/derickarunesudas/",
        display_order: 9
    },
    {
        name: "Dr Debashis Bhattacharya",
        title: "Surgeon & Medical Advisor",
        bio: "A seasoned Surgeon and MNC Medical Advisor, he blends clinical mastery with a sophisticated acumen for enterprise building. As a mentor and investor, he translates deep healthcare expertise into actionable growth strategies.",
        photo_url: "/debashis.webp",
        linkedin_url: "https://www.linkedin.com/in/debashis-bhattacharya-0611a645/",
        display_order: 10
    },
    {
        name: "Anant Sharma",
        title: "Ex-Founder @Tweek Labs",
        bio: "He brings strong experience in building startups, bio-sensing devices and robust IoT systems. Understands the full spectrum of hardware development, from industrial design to electro-mechanical prototyping.",
        photo_url: "/anant.webp",
        linkedin_url: "https://www.linkedin.com/in/anant3110/",
        display_order: 11
    }
];

async function main() {
  await prisma.mentor.deleteMany(); // clear existing
  for (const mentor of mentorsData) {
    await prisma.mentor.create({ data: mentor });
  }
  console.log('Seeded Mentors successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
