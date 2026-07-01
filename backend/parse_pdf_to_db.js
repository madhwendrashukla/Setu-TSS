const fs = require('fs');
const pdf = require('pdf-parse');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    console.log("Parsing PDF...");
    const dataBuffer = fs.readFileSync('d:/setu tss ui ux/grants and scheme/77a5d438-b239-4ec1-a539-d08804635b0b.pdf');
    const data = await pdf(dataBuffer);
    const text = data.text;

    // We split by numbered headings like "1. Name", "2. Name"
    // Since the OCR shows "1. Central Sector Scheme...", we can use regex
    const splits = text.split(/\n\d+\.\s+/);
    splits.shift(); // remove everything before the first scheme

    console.log("Found " + splits.length + " schemes. Clearing old grants...");
    await prisma.grant.deleteMany({});

    for (const chunk of splits) {
        let title = chunk.split('\n')[0].trim();
        let ministry = (chunk.match(/Ministry:\s*(.+)/) || [])[1] || "";
        let sectors = (chunk.match(/Sectors:\s*(.+)/) || [])[1] || "";
        let brief = (chunk.match(/Brief:\s*([\s\S]+?)(?:Eligibility Criteria:|Benefits:|Benefit Tags:)/) || [])[1] || "";
        let eligibility = (chunk.match(/Eligibility Criteria:\s*([\s\S]+?)(?:Benefits:|Benefit Tags:|Quantum\/Size)/) || [])[1] || "";
        let benefits = (chunk.match(/Benefits:\s*([\s\S]+?)(?:Benefit Tags:|Quantum\/Size|Tenure:|Notes:|Apply:)/) || [])[1] || "";
        let benefitTags = (chunk.match(/Benefit Tags:\s*(.+)/) || [])[1] || "";
        let quantum = (chunk.match(/Quantum\/Size of Fund:\s*([\s\S]+?)(?:Tenure:|Notes:|Apply:)/) || [])[1] || "";
        let tenure = (chunk.match(/Tenure:\s*(.+)/) || [])[1] || "";
        let link = (chunk.match(/Apply:\s*(.+)/) || [])[1] || "";

        const clean = (s) => s.trim().replace(/\n/g, ' ');

        await prisma.grant.create({
            data: {
                title: clean(title),
                ministry: clean(ministry),
                sectors: clean(sectors),
                description: clean(brief),
                eligibility: clean(eligibility),
                benefits: clean(benefits),
                benefitTags: clean(benefitTags),
                amount: clean(quantum),
                tenure: clean(tenure),
                link: clean(link),
                is_active: true
            }
        });
    }

    console.log("Successfully seeded grants!");
    process.exit(0);
}

run().catch(console.error);
