"use client";

import { useState } from "react";
import { upsertProduct } from "@/actions/orderActions";
import { AdminImageUploader } from "@/components/AdminImageUploader";

type Category = { id: string; name: string };

type AdminProductFormProps = {
  categories: Category[];
  product?: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    price: unknown;
    compareAtPrice: unknown;
    stock: number;
    categoryId: string;
    colors: string[];
    fabric: string;
    colorFamily: string;
    workType: string;
    weave: string;
    sizes: string[];
    occasions: string[];
    badges: string[];
    rating: number;
    reviewCount: number;
    fabricDetails: string;
    sareeLength: string;
    washCare: string;
    care: string | null;
    shortDescription: string;
    description: string;
    featured: boolean;
    isNewArrival: boolean;
    bestseller: boolean;
    readyToShip: boolean;
    images: string[];
  };
};

export function AdminProductForm({ categories, product }: AdminProductFormProps) {
  const [images, setImages] = useState(product?.images?.join(", ") || "");

  return (
    <form action={upsertProduct} className="grid gap-3 rounded-2xl border border-[#eadfcc] bg-white p-5 shadow-card md:grid-cols-2">
      <input type="hidden" name="id" value={product?.id || ""} />
      <input name="title" required defaultValue={product?.title || ""} placeholder="Title" className="rounded-xl border p-3 text-sm" />
      <input name="slug" required defaultValue={product?.slug || ""} placeholder="Slug" className="rounded-xl border p-3 text-sm" />
      <input name="sku" required defaultValue={product?.sku || ""} placeholder="SKU" className="rounded-xl border p-3 text-sm" />
      <input name="price" required defaultValue={product ? Number(product.price) : ""} type="number" step="0.01" placeholder="Price" className="rounded-xl border p-3 text-sm" />
      <input name="compareAtPrice" defaultValue={product?.compareAtPrice ? Number(product.compareAtPrice) : ""} type="number" step="0.01" placeholder="Compare At Price" className="rounded-xl border p-3 text-sm" />
      <input name="stock" required defaultValue={product?.stock ?? ""} type="number" placeholder="Stock" className="rounded-xl border p-3 text-sm" />
      <select name="categoryId" required defaultValue={product?.categoryId || ""} className="rounded-xl border p-3 text-sm">
        <option value="">Select category</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <AdminImageUploader value={images} onChange={setImages} />
      <input name="colors" required defaultValue={product?.colors?.join(", ") || ""} placeholder="Colors (comma separated)" className="rounded-xl border p-3 text-sm" />
      <input name="fabric" defaultValue={product?.fabric || ""} placeholder="Fabric (e.g. Pure Silk)" className="rounded-xl border p-3 text-sm" />
      <input name="colorFamily" defaultValue={product?.colorFamily || ""} placeholder="Color Family (e.g. Maroon)" className="rounded-xl border p-3 text-sm" />
      <input name="workType" defaultValue={product?.workType || ""} placeholder="Work Type (e.g. Zari Work)" className="rounded-xl border p-3 text-sm" />
      <input name="weave" defaultValue={product?.weave || ""} placeholder="Weave (e.g. Kanjivaram)" className="rounded-xl border p-3 text-sm" />
      <input name="sizes" required defaultValue={product?.sizes?.join(", ") || ""} placeholder="Sizes (comma separated)" className="rounded-xl border p-3 text-sm" />
      <input name="occasions" required defaultValue={product?.occasions?.join(", ") || ""} placeholder="Occasions (comma separated)" className="rounded-xl border p-3 text-sm" />
      <input name="badges" defaultValue={product?.badges?.join(", ") || ""} placeholder="Badges (comma separated)" className="rounded-xl border p-3 text-sm" />
      <input name="rating" defaultValue={product?.rating ?? 4.2} type="number" min="1" max="5" step="0.1" placeholder="Rating (e.g. 4.5)" className="rounded-xl border p-3 text-sm" />
      <input name="reviewCount" defaultValue={product?.reviewCount ?? 0} type="number" placeholder="Review count" className="rounded-xl border p-3 text-sm" />
      <input name="fabricDetails" required defaultValue={product?.fabricDetails || ""} placeholder="Fabric details" className="rounded-xl border p-3 text-sm" />
      <input name="sareeLength" defaultValue={product?.sareeLength || ""} placeholder="Saree Length (default 5.5 meters)" className="rounded-xl border p-3 text-sm" />
      <input name="washCare" defaultValue={product?.washCare || ""} placeholder="Wash Care" className="rounded-xl border p-3 text-sm" />
      <input name="care" defaultValue={product?.care || ""} placeholder="Care instructions" className="rounded-xl border p-3 text-sm" />
      <textarea name="shortDescription" defaultValue={product?.shortDescription || ""} placeholder="Short description" className="rounded-xl border p-3 text-sm md:col-span-2" rows={2} />
      <textarea name="description" required defaultValue={product?.description || ""} placeholder="Description" className="rounded-xl border p-3 text-sm md:col-span-2" rows={4} />
      <div className="flex items-center gap-4 text-sm">
        <label><input type="checkbox" defaultChecked={Boolean(product?.featured)} name="featured" value="true" className="mr-2" />Featured</label>
        <label><input type="checkbox" defaultChecked={Boolean(product?.isNewArrival)} name="isNewArrival" value="true" className="mr-2" />New Arrival</label>
        <label><input type="checkbox" defaultChecked={Boolean(product?.bestseller)} name="bestseller" value="true" className="mr-2" />Bestseller</label>
        <label><input type="checkbox" defaultChecked={Boolean(product?.readyToShip)} name="readyToShip" value="true" className="mr-2" />Ready to Ship</label>
      </div>
      <button className="rounded-xl bg-maroon px-4 py-3 text-sm font-semibold text-white">{product ? "Update Product" : "Add Product"}</button>
    </form>
  );
}

