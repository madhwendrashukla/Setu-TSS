const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const srcDir = path.join(__dirname, '..', 'web', 'app', 'AI-workshop-15may');

function extractArray(filename, varName) {
    const content = fs.readFileSync(path.join(srcDir, filename), 'utf-8');
    const regex = new RegExp(`const ${varName} = (.*?);[\\r\\n]+export function`, 's');
    const match = content.match(regex);
    if (match) {
        // Evaluate the string to get the JS object
        try {
            return eval(`(${match[1]})`);
        } catch(e) {
            console.error(`Failed to eval ${varName} in ${filename}`);
            return [];
        }
    }
    return [];
}

const workshops = extractArray('AIWorkshopCurriculum.tsx', 'workshops');
const tabs = extractArray('AIWorkshopSchedule.tsx', 'tabs');
const mentors = extractArray('AIWorkshopMentors.tsx', 'mentors');
const testimonials = extractArray('AIWorkshopTestimonials.tsx', 'testimonials');
const stories = extractArray('AIWorkshopStoryline.tsx', 'stories');
const tickets = extractArray('AIWorkshopPricing.tsx', 'tickets');
const faqs = extractArray('AIWorkshopFinal.tsx', 'faqs');

// Some files have multiple arrays
function extractMultiple(filename, varNames) {
    const content = fs.readFileSync(path.join(srcDir, filename), 'utf-8');
    let res = {};
    for (const v of varNames) {
        const regex = new RegExp(`const ${v} = (.*?);[\\r\\n]+(?:const|export function)`, 's');
        const match = content.match(regex);
        if (match) {
             res[v] = eval(`(${match[1]})`);
        }
    }
    return res;
}

const outcomesData = extractMultiple('AIWorkshopOutcomes.tsx', ['toolkits', 'audience']);
const pricingData = extractMultiple('AIWorkshopPricing.tsx', ['tickets', 'guarantee']);

const page_blocks = [
    {
        type: "hero",
        data: {
            badge: "Live Workshop Series • May 15–17, 2026",
            title: "AI Startup Launchpad",
            brandAttribution: { p1: "THE ", p2: "STARTUP ", p3: "SCHOOL" },
            subheading: 'From idea to <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">AI-powered MVP</span>',
            subtitle: "Build Validate and Launch your Startup in 3 days",
            stats: ["3 Mentors", "3 Days", "5 Sessions", "12+ Hr", "Live on Zoom"],
            buttonText: "Registrations Closed"
        }
    },
    {
        type: "storyline",
        data: {
            title: "The Entrepreneur's Journey",
            subtitle: "Phase 1",
            stories: stories
        }
    },
    {
        type: "curriculum",
        data: {
            workshops: workshops
        }
    },
    {
        type: "pricing",
        data: {
            tickets: pricingData.tickets || tickets,
            guarantee: pricingData.guarantee || {}
        }
    },
    {
        type: "mentors",
        data: {
            mentors: mentors
        }
    },
    {
        type: "outcomes",
        data: {
            toolkits: outcomesData.toolkits,
            audience: outcomesData.audience
        }
    },
    {
        type: "testimonials",
        data: {
            testimonials: testimonials
        }
    },
    {
        type: "schedule",
        data: {
            tabs: tabs
        }
    },
    {
        type: "faq",
        data: {
            faqs: faqs
        }
    }
];

async function main() {
    await prisma.event.update({
        where: { slug: 'claude-workshop-dummy' },
        data: { page_blocks: page_blocks }
    });
    console.log("Successfully seeded PERFECT base match!");
}
main().finally(() => prisma.$disconnect());
