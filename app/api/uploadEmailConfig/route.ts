import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON data
    const data = await request.json();

    // Check if data exists and is valid
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid data received' },
        { status: 400 }
      );
    }

    // Define the file name and path where the file will be saved
    const filename = `email-config-${Date.now()}.json`;
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const filepath = path.join(dataDir, filename);

    // Ensure the 'data' directory exists
    await mkdir(dataDir, { recursive: true });

    // Write the JSON data to the file
    await writeFile(filepath, JSON.stringify(data, null, 2));

    // Return a successful response
    return NextResponse.json({ success: true, message: 'Email config saved successfully' });

  } catch (error) {
    console.error('Error saving email config:', error);

    // Return a detailed error response with status 500
    return NextResponse.json(
      { success: false, message: 'Failed to save email config' },
      { status: 500 }
    );
  }
}
