import { v2 as cloudinary, UploadStream } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
cloudinary.config({
  cloud_name: "dmw4ou3zu",
  api_key: "273611871567345",
  api_secret: "d2M0byRPsou_7iaGXFaHITH2UmY",
});

interface cloudinaryresult {
  public_id: string;
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
    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await new Promise<cloudinaryresult>((resolve, reject) => {
      const uploadstream = cloudinary.uploader.upload_stream(
        {
          folder: "next-cloudinary-uploads",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as cloudinaryresult);
          }
        }
      );

      uploadstream.end(buffer);
    });
    return NextResponse.json(
      {
        public_id: result.public_id,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
