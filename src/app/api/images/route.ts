import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  console.log('GET /api/images: Starting request');
  try {
    console.log('GET /api/images: Attempting to connect to database');
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        tags: true,
      },
    });
    
    if (!images) {
      console.error('GET /api/images: No images returned from database');
      return NextResponse.json(
        { error: 'No images found' },
        { status: 404 }
      );
    }
    
    console.log(`GET /api/images: Successfully fetched ${images.length} images`);
    return NextResponse.json(images);
  } catch (error) {
    console.error('GET /api/images: Detailed error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Check if it's a Prisma error
    if (error instanceof Error && error.message.includes('PrismaClient')) {
      console.error('GET /api/images: Database connection error');
      return NextResponse.json(
        { error: 'Database connection error', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch images', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('POST /api/images: Starting request');
  try {
    const data = await request.json();
    const image = await prisma.image.create({
      data: {
        name: data.name,
        description: data.description,
        tags: data.tags,
        url: data.url,
      },
    });
    console.log('POST /api/images: Successfully created image');
    return NextResponse.json(image);
  } catch (error) {
    console.error('POST /api/images: Error creating image:', error);
    return NextResponse.json(
      { error: 'Failed to create image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 