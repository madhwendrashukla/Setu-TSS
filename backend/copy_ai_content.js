const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get AI Startup Launchpad
  const aiEvent = await prisma.event.findUnique({
    where: { id: 'dfa47cd2-d36a-4634-afdf-f09bf4e1c2c3' }
  });

  if (!aiEvent) {
    console.error("AI Event not found");
    return;
  }

  // Update dummy event
  const updated = await prisma.event.update({
    where: { slug: "claude-workshop-dummy" },
    data: {
      page_blocks: aiEvent.page_blocks
    }
  });

  console.log("Successfully copied AI Startup Launchpad content to claude-workshop-dummy!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
