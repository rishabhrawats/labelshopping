"use client";

import { useState } from "react";

type AdminImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AdminImageUploader({ value, onChange }: AdminImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);

    const signResponse = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: "products" })
    });

    const signData = await signResponse.json();

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", signData.apiKey);
    body.append("timestamp", String(signData.timestamp));
    body.append("signature", signData.signature);
    body.append("folder", signData.folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
      method: "POST",
      body
    });

    const uploaded = await uploadRes.json();
    if (uploaded.secure_url) {
      const merged = value ? `${value}, ${uploaded.secure_url}` : uploaded.secure_url;
      onChange(merged);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-medium text-stone-700">Product Images</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name="images"
        required
        placeholder="Image URLs (comma separated)"
        className="w-full rounded-xl border p-3 text-sm"
      />
      <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0])} className="w-full text-sm" />
      <p className="text-xs text-stone-500">{uploading ? "Uploading to Cloudinary..." : "Upload one image at a time. It auto-appends to image URLs."}</p>
    </div>
  );
}

