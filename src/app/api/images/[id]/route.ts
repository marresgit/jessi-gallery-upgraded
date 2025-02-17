import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await Promise.resolve(params.id);
  
  try {
    console.log('GET /api/images/[id]: Fetching image with id:', id);
    const image = await prisma.image.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!image) {
      console.error('GET /api/images/[id]: Image not found with id:', id);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    console.log('GET /api/images/[id]: Successfully fetched image');
    return NextResponse.json(image);
  } catch (error) {
    console.error('GET /api/images/[id]: Error fetching image:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await Promise.resolve(params.id);
  
  try {
    const data = await request.json();
    const image = await prisma.image.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        tags: data.tags,
      },
    });
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = await Promise.resolve(params.id);
  
  try {
    await prisma.image.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 