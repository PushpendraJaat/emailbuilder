import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const templateDirectory = path.join(process.cwd(), 'public/data');
        const files = await readdir(templateDirectory);
        // console.log(files);
        return NextResponse.json({ files, success: true, message: "Template fetched successfully" });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Error while fetching template"
            },
            { status: 500 }
        );
    }
}
