import { prisma } from '../lib/db';

async function migrateTags() {
  try {
    // Get all images
    const images = await prisma.image.findMany();
    console.log(`Found ${images.length} images to migrate`);

    // Update each image
    for (const image of images) {
      // If the old tag exists and tags array is empty, migrate it
      if ((image as any).tag && (!image.tags || image.tags.length === 0)) {
        await prisma.image.update({
          where: { id: image.id },
          data: {
            tags: [(image as any).tag], // Convert old single tag to array
          },
        });
        console.log(`Migrated image ${image.id}: ${(image as any).tag} -> ${[(image as any).tag]}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateTags(); 