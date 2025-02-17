import { prisma } from './db';

interface CreateImageData {
  title: string;
  description: string;
  url: string;
}

export async function createImage(data: CreateImageData) {
  try {
    const image = await prisma.image.create({
      data: {
        name: data.title,
        description: data.description,
        url: data.url,
        tag: 'Uncategorized', // Default tag
      },
    });
    return image;
  } catch (error) {
    console.error('Error creating image:', error);
    throw error;
  }
} 