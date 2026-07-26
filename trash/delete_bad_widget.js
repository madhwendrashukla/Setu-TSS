const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Searching for debug chat widgets...");
  const badWidgets = await prisma.chatWidget.findMany({
    where: {
      title: {
        contains: 'THIS IS TITLE',
        mode: 'insensitive'
      }
    }
  });
  
  if (badWidgets.length > 0) {
    console.log(`Found ${badWidgets.length} bad widget(s). Deleting...`);
    for (const w of badWidgets) {
      await prisma.chatWidget.delete({ where: { id: w.id } });
      console.log(`Deleted widget ID: ${w.id} (Title: ${w.title})`);
    }
    console.log('\n✅ TEST PASSED: Successfully destroyed the rogue debug toast from the database.');
  } else {
    console.log('No matching bad widget found by title. Querying all...');
    const all = await prisma.chatWidget.findMany();
    console.log(all);
    
    // Maybe try finding by subtitle 'YES'
    const yesWidgets = all.filter(w => w.subtitle === 'YES' || w.title === 'THIS IS TITLE');
    for (const w of yesWidgets) {
      await prisma.chatWidget.delete({ where: { id: w.id } });
      console.log(`Deleted widget ID: ${w.id} (Title: ${w.title})`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
