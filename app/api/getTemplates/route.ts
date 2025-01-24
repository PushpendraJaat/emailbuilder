import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import EmailConfig from '@/models/EmailConfig';

// Disable static caching and force dynamic behavior
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fresh database connection for each request
    await dbConnect();

    // Get latest documents with strong read concern
    const emailConfigs = await EmailConfig.find()
      .sort({ createdAt: -1 }) // Ensure latest first
      .readConcern('majority') // Strong consistency
      .lean();

    // Add cache control headers to response
    const response = NextResponse.json({
      success: true,
      message: "Email configurations fetched successfully",
      data: emailConfigs,
      timestamp: Date.now() // For client-side validation
    });

    // Prevent all caching layers from storing this response
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Vercel-CDN-Cache-Control', 'no-cache');
    response.headers.set('CDN-Cache-Control', 'no-cache');

    return response;

  } catch (error) {
    console.error('[EMAIL_CONFIG_GET_ERROR]', error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Error while fetching email configurations",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}