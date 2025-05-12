import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: "dmw4ou3zu",
  api_key: "273611871567345",
  api_secret: "d2M0byRPsou_7iaGXFaHITH2UmY",
});

interface CloudinaryResult {
  public_id: string;
  bytes: string;
  duration: string;
  [key: string]: string;
}

export async function POST(req: NextRequest) {
  
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formdata = await req.formData();
    const file = formdata.get("file") as File;
    const title = formdata.get("title") as string;
    const description = formdata.get("description") as string;
    const originalsize = formdata.get("originalsize") as string;
    const compressessize = formdata.get("compressessize") as string;
    const duration = formdata.get("duration") as string;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "video-upload",
          resource_type: "video",
          transformation: [
            {
              quality: "auto",
              fetch_format: "mp4", 
            },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as unknown as CloudinaryResult);
        }
      );

      uploadStream.end(buffer);
    });

    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicid: result.public_id,
        originalsize,
        compressessize,
        duration,
       id:userId,
      },
    });

    return NextResponse.json({video});
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }finally{
    await prisma.$disconnect()
  }
}














