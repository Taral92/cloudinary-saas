import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


cloudinary.config({
  cloud_name: "dmw4ou3zu",
  api_key: "273611871567345",
  api_secret: "d2M0byRPsou_7iaGXFaHITH2UmY",
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: unknown
}

export async function POST(request: NextRequest) {
  const {userId} = await auth()

  if (!userId) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401})
  }

  try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if(!file){
          return NextResponse.json({error: "File not found"}, {status: 400})
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const result = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                  {folder: "next-cloudinary-uploads"},
                  (error, result) => {
                      if(error) reject(error);
                      else resolve(result as CloudinaryUploadResult);
                  }
              )
              uploadStream.end(buffer)
          }
      )
      return NextResponse.json(
       
        {
          publicId: result.public_id,
          url: result.secure_url,
          message:"Image uploaded successfully",
        },
        {
          status: 200
        }
      )

  } catch (error) {
      console.log("UPload image failed", error)
      return NextResponse.json({error: "Upload image failed"}, {status: 500})
  }

}