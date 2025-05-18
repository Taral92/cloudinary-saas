// For App Router (route.ts)
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import mammoth from "mammoth";


export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return NextResponse.json({ error: "Please upload a valid .docx file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { value } = await mammoth.extractRawText({ buffer });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  page.drawText(value.substring(0, 1000), {
    x: 50,
    y: height - 100,
    size: 12,
    color: rgb(0, 0, 0),
    maxWidth: width - 100,
  });

  const pdf = await pdfDoc.save();

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=converted.pdf",
    },
  });
}