import { NextResponse } from "next/server";
import { listImages } from "@/lib/s3";

export async function GET() {
  try {
    const images = await listImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error("List images failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to list images";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
