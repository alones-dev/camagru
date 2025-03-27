import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const authorId = formData.get('authorId') as string;

    if (!file || !authorId) {
      return NextResponse.json(
        { error: 'Missing file or authorId' }, 
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `post-${Date.now()}${path.extname(file.name)}`;
    const relativePath = `/uploads/${filename}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(filePath, buffer);

    const post = await prisma.post.create({
      data: {
        imagePath: relativePath,
        authorId: authorId,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}