const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const GALLERY_PHOTOS = [
    "/gallery/IMG_0845.webp",
    "/gallery/IMG_1280.webp",
    "/gallery/IMG_1318.webp",
    "/gallery/IMG_1319.webp",
    "/gallery/IMG_1342.webp",
    "/gallery/IMG_1371.webp",
    "/gallery/IMG_1378.webp",
    "/gallery/IMG_1380.webp",
  ];

  for (let i = 0; i < GALLERY_PHOTOS.length; i++) {
    // Check if it exists
    const exists = await prisma.galleryItem.findFirst({
      where: { media_url: GALLERY_PHOTOS[i] }
    });
    
    if (!exists) {
      await prisma.galleryItem.create({
        data: {
          type: "image",
          media_url: GALLERY_PHOTOS[i],
          display_order: i + 1,
          is_active: true
        }
      });
    }
  }

  console.log("Successfully seeded 8 default gallery photos!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
