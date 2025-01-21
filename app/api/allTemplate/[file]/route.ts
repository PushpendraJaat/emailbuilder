import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Handle GET requests for /api/templates/[file]
export async function GET(req: Request, { params }: { params: { file: string } }) {
    try {
        const { file } = params;

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'File name is required' },
                { status: 400 }
            );
        }

        // Define the path to the public data directory
        const dataDirectory = path.join(process.cwd(), 'public/data'); // Path to your data folder

        // Construct the full file path
        const filePath = path.join(dataDirectory, file);

        // Validate the file path
        if (!filePath.startsWith(dataDirectory)) {
            return NextResponse.json(
                { success: false, message: 'Invalid file path' },
                { status: 400 }
            );
        }

        // Read the file content asynchronously
        const fileContent = await readFile(filePath, 'utf-8');

        // Return the content as a string
        return NextResponse.json({ success: true, template: fileContent });
    } catch (error) {
        console.error('Error reading file:', error);

        if (error.code === 'ENOENT') {
            return NextResponse.json(
                { success: false, message: 'Template file not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Failed to load template file' },
            { status: 500 }
        );
    }
}
