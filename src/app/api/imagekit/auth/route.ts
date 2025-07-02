
import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
    throw new Error("ImageKit environment variables are not properly configured.");
}

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function GET(req: NextRequest) {
  try {
    const result = imagekit.getAuthenticationParameters();
    return NextResponse.json(result);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    // Cast error to Error type to safely access message property
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to authenticate with ImageKit", details: errorMessage }, { status: 500 });
  }
}
