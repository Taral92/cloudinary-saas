import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from "../../../../@prisma/client";
const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryResult {
  public_id: string;
  bytes: number;
  duration: number;
  [key: string]: string | number;
}

export async function  POST(req: NextRequest) {
  
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formdata = await req.formData();
    const file = formdata.get("file") as File;
    const title = formdata.get("title") as string;
    const description = formdata.get("description") as string | null;
    const originalsize = formdata.get("originalsize") as string | null;
    const compressessize = formdata.get("compressessize") as string | null;
    const duration = formdata.get("duration") as string | null;

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
        description: description ?? "",
        publicid: result.public_id,
        originalsize: originalsize ?? "",
        compressessize: compressessize ?? "",
        duration: duration ?? "",
        userId:userId ?? ""
      },
    });

    return NextResponse.json({video,url:result.secure_url},{status:200});
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 })
     
  }finally{
    await prisma.$disconnect()
  }
}














