const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const galleryData = [
    { type: "image", media_url: "/gallery/IMG_0845.webp", display_order: 1 },
    { type: "image", media_url: "/gallery/IMG_1280.webp", display_order: 2 },
    { type: "image", media_url: "/gallery/IMG_1318.webp", display_order: 3 },
    { type: "image", media_url: "/gallery/IMG_1319.webp", display_order: 4 },
    { type: "image", media_url: "/gallery/IMG_1342.webp", display_order: 5 },
    { type: "image", media_url: "/gallery/IMG_1371.webp", display_order: 6 },
    { type: "image", media_url: "/gallery/IMG_1378.webp", display_order: 7 },
    { type: "image", media_url: "/gallery/IMG_1380.webp", display_order: 8 },
];

const testimonialsData = [
    { type: 'video', youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', video_heading: 'Incredible Experience', video_description: 'This program changed my startup trajectory.', show_description: true, name: 'Video 1', display_order: 1 },
    { type: 'text', name: 'Rahul Sharma', quote: 'The mentorship was exactly what I needed to raise my seed round.', city: 'Bangalore', display_order: 2 },
    { type: 'text', name: 'Sneha Patel', quote: 'Met my co-founder here. Best decision ever.', city: 'Mumbai', display_order: 3 },
    { type: 'text', name: 'Vikram Singh', quote: 'The community is unmatched. You learn so much just by being in the room.', city: 'Delhi', display_order: 4 },
];

const partnersData = [
    { name: 'Partner 1', logo_url: 'https://via.placeholder.com/150x80?text=Partner+1', website_url: '#', display_order: 1 },
    { name: 'Partner 2', logo_url: 'https://via.placeholder.com/150x80?text=Partner+2', website_url: '#', display_order: 2 },
    { name: 'Partner 3', logo_url: 'https://via.placeholder.com/150x80?text=Partner+3', website_url: '#', display_order: 3 },
    { name: 'Partner 4', logo_url: 'https://via.placeholder.com/150x80?text=Partner+4', website_url: '#', display_order: 4 },
];

const programsData = [
    {
        title: "The Spark",
        subtitle: "3-Day Ignition Sprint",
        description: "Validate your startup idea over one intense weekend with rigorous teardowns and expert mentorship.\nLocations: Mumbai, Delhi / NCR",
        duration: "3 Days",
        price: "Contact Us",
        cta_text: "Show your interest",
        lead_source_tag: "program_spark",
        display_order: 1
    },
    {
        title: "The Transformation",
        subtitle: "30-Days Deep-Dive",
        description: "100-day acceleration packed into 30 days. Build your MVP, secure early customers, and refine your pitch.\nLocation: Mumbai Exclusive",
        duration: "30 Days",
        price: "Contact Us",
        cta_text: "Show your interest",
        lead_source_tag: "program_transformation",
        display_order: 2
    }
];

async function main() {
    console.log("Seeding Phase 1 data...");
    
    // Clear old data
    await prisma.galleryItem.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.communityPartner.deleteMany();
    await prisma.program.deleteMany();

    // Insert new data
    for (const item of galleryData) {
        await prisma.galleryItem.create({ data: item });
    }
    for (const item of testimonialsData) {
        await prisma.testimonial.create({ data: item });
    }
    for (const item of partnersData) {
        await prisma.communityPartner.create({ data: item });
    }
    for (const item of programsData) {
        await prisma.program.create({ data: item });
    }

    console.log("Phase 1 Seeding Complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
