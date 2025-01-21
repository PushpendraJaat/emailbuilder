import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const { title, content, imageUrl } = await request.json();


  try {
    const layoutPath = path.join(process.cwd(), 'public', 'layout2.html');
    const layout = await readFile(layoutPath, 'utf-8');

    // Render the email template by replacing placeholders
    const renderedTemplate = layout
      .replace(/{{title}}/g, title || 'Default Title') 
      .replace(/{{content}}/g, content || 'Default Content') 
      .replace(/{{imageUrl}}/g, imageUrl || '');  

    // Return the rendered HTML as a downloadable file
    return new NextResponse(renderedTemplate, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="email_template.html"',
      },
    });
  } catch (error) {
    console.error('Error rendering template:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate email template' },
      { status: 500 }
    );
  }
}
