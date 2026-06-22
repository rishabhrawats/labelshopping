"use client";

import { useState } from "react";

type AdminImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AdminImageUploader({ value, onChange }: AdminImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (files?: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const signResponse = await fetch("/api/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "products" })
        });

        if (!signResponse.ok) throw new Error("Unable to authorize image upload.");
        const signData = await signResponse.json();

        const body = new FormData();
        body.append("file", file);
        body.append("api_key", signData.apiKey);
        body.append("timestamp", String(signData.timestamp));
        body.append("signature", signData.signature);
        body.append("folder", signData.folder);

        const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, {
          method: "POST",
          body
        });
        const uploaded = await uploadResponse.json();

        if (!uploadResponse.ok || !uploaded.secure_url) throw new Error("An image could not be uploaded.");
        uploadedUrls.push(uploaded.secure_url);
      }

      const existing = value.split(",").map((url) => url.trim()).filter(Boolean);
      onChange([...existing, ...uploadedUrls].join(", "));
    } catch (uploadError) {
      setError((uploadError as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const images = value.split(",").map((url) => url.trim()).filter(Boolean);

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
      {images.length ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative aspect-[2/3] overflow-hidden rounded-lg border border-border bg-cream">
              {/* Admin-provided Cloudinary and local URLs are previewed here. */}
              <img src={url} alt={`Product ${index + 1}`} className="h-full w-full object-cover object-top" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index).join(", "))}
                className="absolute right-1 top-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-red-700 shadow"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <input type="file" multiple accept="image/*" onChange={(event) => handleUpload(event.target.files)} className="w-full text-sm" />
      <p className="text-xs text-stone-500">{uploading ? "Uploading images..." : "Select one or several images. They are uploaded and added to the product gallery."}</p>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

