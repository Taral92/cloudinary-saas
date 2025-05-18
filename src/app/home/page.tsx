"use client";
import React from "react";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen gap-5 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <div>
      <h1 className="text-4xl font-extrabold mb-8 tracking-wide">
        🔥 Choose Your Action
      </h1>
      </div>

      <div>
      <button
        onClick={() => router.push("/socialshare")}
        className="w-60 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:scale-105 py-5 transition duration-300"
      >
        📸 Upload Image
      </button>
      </div>

      <div> 
      <button
        onClick={() => router.push("/video-upload")}
        className="w-60 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:scale-105 transition duration-300"
      >
        🎥 Upload Video
      </button>
      </div>

      <div>
      <button
        onClick={() => router.push("/page-pdf")}
        className="w-60 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:scale-105 transition duration-300"
      >
        📄 DOCX ➡ PDF
      </button>
      </div>
    </div>
  );
}

export default Home;
