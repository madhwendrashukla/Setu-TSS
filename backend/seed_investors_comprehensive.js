const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const mdPath = path.join(__dirname, '..', 'investors_comprehensive.md');
    const content = fs.readFileSync(mdPath, 'utf8');

    // Split by "## " to get each investor block
    const blocks = content.split('## ').slice(1); // skip the first intro part

    const investors = [];

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        
        // 1. Extract Name
        // First line is like "1. 100X.VC"
        const titleLine = block.split('\n')[0].trim();
        const matchTitle = titleLine.match(/^\d+\.\s+(.+)$/);
        
        if (!matchTitle) continue;
        
        let name = matchTitle[1].trim();

        let firm = name;
        let type = null;
        let stages = [];
        let sectors = [];
        let ticketSize = null;
        let linkedin = null;
        let logo_url = null;
        let poc_photo_url = null;
        let poc_name = null;
        let poc_designation = null;
        let poc_linkedin = null;
        let portfolio_cos = [];
        let portfolio_logos = [];
        let twitter = null;
        let org_linkedin = null;
        
        const lines = block.split('\n');
        for (const line of lines) {
            if (line.includes('| **Fund/Company** |')) {
                firm = line.split('|')[2].trim();
                if (firm === 'None') firm = name;
            } else if (line.includes('| **Type** |')) {
                type = line.split('|')[2].trim();
                if (type === 'None') type = null;
            } else if (line.includes('| **POC Name** |')) {
                poc_name = line.split('|')[2].trim();
                if (poc_name === 'None') poc_name = null;
            } else if (line.includes('| **Designation** |')) {
                poc_designation = line.split('|')[2].trim();
            } else if (line.includes('| **Funding Stages** |')) {
                const s = line.split('|')[2].trim();
                if (s && s !== 'None') {
                    stages = s.split(',').map(x => x.trim()).filter(Boolean);
                }
            } else if (line.includes('| **Sectors** |')) {
                const s = line.split('|')[2].trim();
                if (s && s !== 'None') {
                    sectors = s.split(',').map(x => x.trim()).filter(Boolean);
                }
            } else if (line.includes('| **Portfolio Cos** |')) {
                const s = line.split('|')[2].trim();
                if (s && s !== 'None') {
                    portfolio_cos = s.split(',').map(x => x.trim()).filter(Boolean);
                }
            } else if (line.includes('| **Check Size** |')) {
                const s = line.split('|')[2].trim();
                if (s && s !== 'None') ticketSize = s;
            } else if (line.includes('| **🐦 Twitter** |')) {
                const matchLink = line.match(/\[([^\]]+)\]/);
                if (matchLink) twitter = matchLink[1].trim();
            } else if (line.includes('| **💼 LinkedIn (Org)** |')) {
                const matchLink = line.match(/\[([^\]]+)\]/);
                if (matchLink) org_linkedin = matchLink[1].trim();
                if (!linkedin) linkedin = org_linkedin;
            } else if (line.includes('| **💼 LinkedIn (POC)** |')) {
                 const matchLink = line.match(/\[([^\]]+)\]/);
                 if (matchLink) poc_linkedin = matchLink[1].trim();
                 if (!linkedin) linkedin = poc_linkedin;
            } else if (line.includes('| **🏢 Logo** |')) {
                const matchImg = line.match(/!\[.*?\]\(([^)]+)\)/);
                if (matchImg) logo_url = matchImg[1].trim();
            } else if (line.includes('| **👤 POC Photo** |')) {
                const matchImg = line.match(/!\[.*?\]\(([^)]+)\)/);
                if (matchImg) poc_photo_url = matchImg[1].trim();
            } else if (line.includes('| **📎 Portfolio Logo')) {
                const matchImg = line.match(/!\[.*?\]\(([^)]+)\)/);
                if (matchImg) portfolio_logos.push(matchImg[1].trim());
            }
        }

        if (!logo_url && poc_photo_url) {
            logo_url = poc_photo_url;
        }
        poc_photo = poc_photo_url;

        // 3. Extract Bio (About)
        let about = null;
        const bioMatch = block.match(/\*\*Bio:\*\*\s*([\s\S]+?)(?=\n\n|$)/);
        if (bioMatch) {
            about = bioMatch[1].trim();
            // remove trailing '---' if accidentally caught
            about = about.replace(/^---+$/m, '').trim();
        }

        investors.push({
            name,
            firm,
            type,
            stages,
            sectors,
            ticketSize,
            about,
            linkedin,
            logo_url,
            poc_name,
            poc_designation,
            poc_linkedin,
            poc_photo,
            portfolio_cos,
            portfolio_logos: portfolio_logos.length ? portfolio_logos : null,
            twitter,
            org_linkedin,
            is_active: true
        });
    }

    console.log(`Parsed ${investors.length} investors. Seeding database...`);

    // Delete existing records to start fresh
    await prisma.investor.deleteMany({});
    console.log("Deleted old investors.");

    const batchSize = 50;
    for (let i = 0; i < investors.length; i += batchSize) {
        const batch = investors.slice(i, i + batchSize);
        await prisma.investor.createMany({ data: batch });
    }

    console.log("Seeding complete! Successfully added", investors.length, "investors.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
