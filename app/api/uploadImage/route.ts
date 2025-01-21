import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { mkdir } from 'fs/promises'; // Ensure the directory exists

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('image') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`; // Sanitize filename
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    // Ensure the uploads directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write the file
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
