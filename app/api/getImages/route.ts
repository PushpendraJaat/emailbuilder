import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const imagesDirectory = path.join(process.cwd(), 'public/uploads');
        const files = await readdir(imagesDirectory);
        // console.log(files);
        return NextResponse.json({ files, success: true, message: "Images fetched successfully" });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while fetching images"
            },
            { status: 500 }
        );
    }
}
