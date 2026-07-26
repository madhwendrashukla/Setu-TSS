const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const eventId = '917ea102-1112-4132-862c-3a3b19fb0bd6';

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event) {
    console.error("Event not found");
    return;
  }

  const pageBlocks = Array.isArray(event.page_blocks) 
    ? event.page_blocks 
    : (typeof event.page_blocks === 'object' && event.page_blocks !== null ? [event.page_blocks] : []);

  // Assuming page_blocks contains an object with pricing_options 
  // Let's just create a completely fresh page data if it's empty, or merge it.
  
  // Actually, wait, the builder usually works with a single JSON object for page_blocks in some cases.
  // Wait, let's just log what event.page_blocks is first.
  console.log(JSON.stringify(event.page_blocks, null, 2));

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
