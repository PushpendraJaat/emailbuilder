import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Ensure this path matches your dbConnect file
import EmailConfig from '@/models/EmailConfig'; // Ensure this path matches your EmailConfig model

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all email configurations from the collection
    const emailConfigs = await EmailConfig.find().lean();
    console.log(emailConfigs);
    

    // Return the fetched email configurations as a response
    return NextResponse.json({
      success: true,
      message: "Email configurations fetched successfully",
      data: emailConfigs,
    });
  } catch (error) {
    console.error('Error fetching email configurations:', error);

    // Return a detailed error response
    return NextResponse.json(
      {
        success: false,
        message: "Error while fetching email configurations",
      },
      { status: 500 }
    );
  }
}
