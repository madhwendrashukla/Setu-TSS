require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const event = await prisma.event.findFirst();
    console.log("Database connected successfully! Sample data:", event ? "Found event: " + event.title : "No events found, but connection works.");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
