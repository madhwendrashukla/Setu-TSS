const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const existing = await prisma.homepageContent.findFirst();
    
    const defaults = {
        hero_heading: 'Stop Ideating. <br/> Start <span class="text-[#A855F7]">Building.</span>',
        hero_tagline: 'Join the alternate B-school for Aspiring Founders.',
        hero_scene1_heading: '<span class="text-xs md:text-sm font-bold tracking-[0.2em] text-[#A855F7] uppercase mb-4 block">THE INCUBATOR</span> <br/> The 0 &rarr; 1 Bridge <br/> Where Founders Are Built.',
        hero_scene1_tagline: 'We close 4 deadly gaps: Learning, Access, Mentoring, Community',
        hero_scene2_heading: '<span class="text-xs md:text-sm font-bold tracking-[0.2em] text-[#A855F7] uppercase mb-4 block">THE ROADMAP</span> <br/> 3 days of ignition sprint <br/> <span class="text-text-secondary text-2xl md:text-3xl block my-2"> to </span> <span class="text-[#A855F7]">100 days of Deep Dive Immersion cohorts</span>',
        hero_scene2_tagline: '<i class="font-normal">Choose the program that fits you the best</i>',
        hero_rotation_seconds: 5
    };

    if (existing) {
        // Only update fields that are null or empty
        const updateData = {};
        for (const [key, value] of Object.entries(defaults)) {
            if (!existing[key] || existing[key] === "") {
                updateData[key] = value;
            }
        }
        
        if (Object.keys(updateData).length > 0) {
            await prisma.homepageContent.update({
                where: { id: existing.id },
                data: updateData
            });
            console.log("Updated existing homepage content with defaults.");
        } else {
            console.log("Homepage content already exists and has data.");
        }
    } else {
        await prisma.homepageContent.create({
            data: defaults
        });
        console.log("Created new homepage content with defaults.");
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
