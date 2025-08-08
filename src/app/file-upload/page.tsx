"use client";

import { useState } from "react";

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠ Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ File uploaded successfully!");
        setFile(null);
        setPreview(null);
      } else {
        setMessage("❌ Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("⚠ An error occurred during upload.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📤 Upload Image with Preview</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        {/* File Input */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Choose an image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500 
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
        </label>

        {/* Image Preview */}
        {preview && (
          <div>
            <p className="mb-2 font-semibold">Preview:</p>
            <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Upload
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className="mt-4 text-sm font-medium">{message}</p>
      )}
    </div>
  );
}
