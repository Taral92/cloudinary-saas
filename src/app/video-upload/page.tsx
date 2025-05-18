"use client";
import React, { useState } from "react";
import axios from "axios";

import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [videoid, setvideoid] = useState<string | null>(null);

 

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size too large");
      return;
    }

    setIsUploading(true);
    setvideoid(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      if (response.status === 200) {
        const publicId = response.data.publicId;
        setvideoid(publicId);
        alert("Video uploaded successfully");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Upload error:", error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        if ("response" in error) {
          console.log(
            "Upload error:",
            (error as unknown as { response: { data: unknown } }).response?.data
          );
        }
      } else {
        console.log("Unknown upload error", error);
      }
      alert("Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
      <div>
        {videoid && (
          <div className="mt-8 flex justify-center items-center bg-black rounded-2xl shadow-lg p-4">
            <div className="w-full max-w-5xl aspect-video overflow-hidden rounded-xl border border-gray-700">
              <CldVideoPlayer width="100%" height="100%" src={videoid} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoUpload;
