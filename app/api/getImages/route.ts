import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Disable static caching and force dynamic behavior
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables not configured');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryFile {
  secure_url: string;
  public_id: string;
  created_at: string;
}

export async function GET() {
  try {
    // Fetch resources with cache-busting parameters
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'uploads/',
      max_results: 100,
      tags: true,
      context: true,
      timestamp: Date.now() // Cache busting
    });

    // Add cache control headers to response
    const responseObj = NextResponse.json({
      success: true,
      message: 'Images fetched successfully',
      data: {
        files: response.resources.map((file: CloudinaryFile) => ({
          url: file.secure_url,
          filename: file.public_id,
          uploadedAt: file.created_at
        })),
        timestamp: Date.now()
      }
    });

    // Prevent all caching layers from storing this response
    responseObj.headers.set('Cache-Control', 'no-store, max-age=0');
    responseObj.headers.set('Vercel-CDN-Cache-Control', 'no-cache');
    responseObj.headers.set('CDN-Cache-Control', 'no-cache');

    return responseObj;

  } catch (error) {
    console.error('[CLOUDINARY_GET_ERROR]', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error while fetching images',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}