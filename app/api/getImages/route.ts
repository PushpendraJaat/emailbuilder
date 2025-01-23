import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

export async function GET() {
  try {
    // Fetch resources from the `uploads` folder in your Cloudinary account
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'uploads/', // Folder name in Cloudinary
      max_results: 100,   // Adjust this as needed
    });

    const files = response.resources.map((file: { secure_url: string; public_id: string }) => ({
      url: file.secure_url,
      filename: file.public_id,
    }));

    return NextResponse.json({ success: true, files, message: 'Images fetched successfully' });
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return NextResponse.json(
      { success: false, message: 'Error while fetching images' },
      { status: 500 }
    );
  }
}
