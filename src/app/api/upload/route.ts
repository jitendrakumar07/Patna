import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Convert File → Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save to "uploads" folder (inside project root)
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = path.join(uploadDir, file.name);
  fs.writeFileSync(filePath, buffer);

  console.log("File saved to:", filePath);

  return NextResponse.json({ message: "File uploaded successfully" });
}
