"use client";
import React, { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { jsPDF } from "jspdf";

const socialformats = {
  "instagram-square": {
    width: 1080,
    height: 1080,
    crop: "fill",
    format: "instagram_square",
    aspectRatio: "1:1",
  },
  twitter: {
    width: 1200,
    height: 675,
    crop: "fill",
    format: "twitter",
    aspectRatio: "16:9",
  },
  facebook: {
    width: 1200,
    height: 630,
    crop: "fill",
    format: "facebook",
    aspectRatio: "16:9",
  },
  twitterheader: {
    width: 1500,
    height: 500,
    crop: "fill",
    format: "twitter_header",
    aspectRatio: "3:1",
  },
};
type socialformat = keyof typeof socialformats;
const SocialShare = () => {
  const [uploadimage, setuploadimage] = useState<string | null>(null);
  const [format, setformat] = useState<socialformat>("instagram-square");
  const [isloading, setisloading] = useState<boolean>(false);
  const [istransforming, setistransforming] = useState<boolean>(false);
  const imageref = useRef<HTMLImageElement | null>(null);
  console.log(uploadimage);
  useEffect(() => {
    if (uploadimage) {
      setistransforming(true);
    }
  }, [uploadimage, format]);
  const handlefile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setisloading(true);
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formdata,
      });
      if (!response.ok) throw new Error("failed to upload a image");
      const data = await response.json();
      setuploadimage(data.url);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setisloading(false);
    }
  };
  const handledownload = async () => {
    try {
      const response = await fetch(uploadimage!, { mode: "cors" });

      if (!response.ok) {
        console.error("Fetch failed:", response.status, response.statusText);
        return;
      }

      const blob = await response.blob();
      console.log("Blob received:", blob);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      console.log(url);
      a.href = url;
      a.download = `image-${format}.jpg`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  const handlePdfDownload = async () => {
    if (!uploadimage) return;
  
    const response = await fetch(uploadimage);
    const blob = await response.blob();
  
    const reader = new FileReader();
    reader.onload = () => {
      const imgData = reader.result as string;
      const pdf = new jsPDF({
        orientation:
          socialformats[format].width > socialformats[format].height
            ? "landscape"
            : "portrait",
        unit: "px",
        format: [socialformats[format].width, socialformats[format].height],
      });
  
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        socialformats[format].width,
        socialformats[format].height
      );
      pdf.save(`social-${format}.pdf`);
    };
    reader.readAsDataURL(blob);
  };
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Social Media Image Creator
      </h1>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose an image file</span>
            </label>
            <input
            accept=".jpg,.jpeg,.png"
              type="file"
              onChange={handlefile}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isloading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadimage && (
            <div className="mt-6">
              <h2 className="card-title mb-4">Select Social Media Format</h2>
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={format}
                  onChange={(e) => setformat(e.target.value as socialformat)}
                >
                  {Object.keys(socialformats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <div className="flex justify-center">
                  {istransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}
                  <CldImage
                    className="cld-image"
                    width={socialformats[format].width}
                    height={socialformats[format].height}
                    src={uploadimage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialformats[format].aspectRatio}
                    gravity="auto"
                    ref={imageref}
                    onLoad={() => setistransforming(false)}
                  />
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary" onClick={handledownload}>
                  Download for {format}
                </button>
                <button className="btn btn-primary" onClick={handlePdfDownload}>
                  Download for pdf {format}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default SocialShare;
