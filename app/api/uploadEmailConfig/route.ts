// app/api/uploadEmailConfig/route.ts
import EmailConfig from '@/models/EmailConfig';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

interface EmailConfigBody {
  title: string;
  content: string;
  image: string;
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body: EmailConfigBody = await request.json();

    if (!body.title || !body.content || !body.image) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailConfig = new EmailConfig({
      title: body.title,
      content: body.content,
      imageUrl: body.image,
    });

    await emailConfig.save();

    return NextResponse.json(
      { success: true, data: emailConfig },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Explicitly handle unsupported methods
export function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}