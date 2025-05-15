"use client";
import { useState } from "react";

export default function DocxToPDFConverter() {
  const [file, setFile] = useState<File | null>(null);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please upload a .docx file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/pdftodocfile", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
    } else {
      alert("Conversion failed");
    }
  };

  return (
    <form onSubmit={handleConvert}>
      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Convert to PDF</button>
    </form>
  );
}