"use client";
import axios from "axios";
import React, { useState } from "react";

export default function VideoUpload() {
  const [file, setfile] = useState<File | null>(null);
  const [title, settitle] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [isuploaing, setisuploaing] = useState<boolean>(false);
  const [videourl, setvideourl] = useState<string | null>(null);

  const handlefilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setfile(file ?? null);
  };
  const handledownalod = (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      if (!videourl) return;
      const a = document.createElement("a");
      a.href = videourl;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("file is not found");
    }
    setisuploaing(true);
    try {
      const formdata = new FormData();
      formdata.append("file", file ?? "");
      formdata.append("title", title);
      formdata.append("description", description);
      const response =await fetch("/api/video-upload",{
        method:"POST",
        body:formdata
      })
      const data = await response.json();
      if (data.status === 200) {
        alert("Video uploaded successfully");
        setvideourl(data.url);
      }
      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setisuploaing(false);
    }
  };
  return (
    <div>
      <h1>Video Upload</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handlefilechange} />
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => settitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Desription"
          onChange={(e) => setdescription(e.target.value)}
        />
        <button type="submit" disabled={isuploaing}>
          Upload
        </button>
        {isuploaing ? "Uploading..." : "Upload"}
      </form>
      {videourl && (
        <div>
          <video src={videourl!} controls />
          <button onClick={handledownalod}>Download</button>
        </div>
      )}
    </div>
  );
}
