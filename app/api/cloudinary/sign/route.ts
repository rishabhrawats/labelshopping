import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerAuthSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { folder = "products" } = (await request.json()) as { folder?: string };
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + (process.env.CLOUDINARY_API_SECRET || ""))
    .digest("hex");

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder
  });
}

