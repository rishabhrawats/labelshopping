"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { addToCart } from "@/actions/cartActions";
import { currency } from "@/lib/utils";
import { fallbackSareeImage } from "@/lib/product-images";
import { withBasePath } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type ProductDetailClientProps = {
  product: {
    id: string;
    title: string;
    categoryName: string;
    categorySlug: string;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
    description: string;
    shortDescription?: string;
    fabricDetails: string;
    fabric: string;
    colorFamily: string;
    workType: string;
    weave: string;
    sareeLength: string;
    blousePieceIncluded: boolean;
    washCare: string;
    care?: string | null;
    stock: number;
    badges?: string[];
    rating: number;
    reviewCount: number;
    readyToShip: boolean;
  };
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImage, setActiveImage] = useState(withBasePath(product.images[0] || fallbackSareeImage));
  const [size, setSize] = useState(product.sizes[0] ?? "Free Size");
  const [color, setColor] = useState(product.colors[0] ?? "Default");
  const [fallPico, setFallPico] = useState(false);
  const [stitching, setStitching] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    const key = "labelsaumya:recently-viewed";
    const raw = localStorage.getItem(key);
    const items = raw ? (JSON.parse(raw) as string[]) : [];
    const next = [product.id, ...items.filter((id) => id !== product.id)].slice(0, 8);
    localStorage.setItem(key, JSON.stringify(next));
  }, [product.id]);

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <section className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collection/all" }, { label: product.categoryName, href: `/collection/${product.categorySlug}` }, { label: product.title }]} />

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-[2/3] max-h-[760px] overflow-hidden rounded-2xl bg-[#f8f5f2] shadow-card">
            <Image src={activeImage} alt={product.title} fill onError={() => setActiveImage(withBasePath(fallbackSareeImage))} className="object-cover object-top" sizes="50vw" priority />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img) => {
              const normalizedImg = withBasePath(img || fallbackSareeImage);
              return (
                <button key={img} onClick={() => setActiveImage(normalizedImg)} className={`relative h-24 overflow-hidden rounded-xl border ${activeImage === normalizedImg ? "border-maroon" : "border-border"}`}>
                  <Image src={normalizedImg} alt={product.title} fill className="object-cover object-top" sizes="20vw" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {(product.badges || []).slice(0, 3).map((badge) => <Badge key={badge}>{badge}</Badge>)}
            {product.readyToShip ? <Badge className="text-[#2b5d35] border-[#8ac79c] bg-[#e8f8ec]">Ready to Ship</Badge> : null}
          </div>
          <h1 className="font-display text-h1 text-maroon">{product.title}</h1>
          <p className="text-body text-muted">{product.shortDescription || "Luxuriously draped saree tailored for premium festive and wedding wardrobes."}</p>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-maroon">{currency(product.price)}</p>
            {product.compareAtPrice ? <p className="text-muted line-through">{currency(product.compareAtPrice)}</p> : null}
            {discount > 0 ? <Badge>{discount}% OFF</Badge> : null}
          </div>
          <p className="text-small text-muted">? {product.rating.toFixed(1)} ({product.reviewCount} reviews)</p>
          <p className="text-small text-muted">Availability: <span className="font-semibold text-ink">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span></p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Color</label>
              <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded-xl border border-border bg-white p-3 text-sm">
                {product.colors.map((value) => <option key={value}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-xl border border-border bg-white p-3 text-sm">
                {product.sizes.map((value) => <option key={value}>{value}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-sm font-semibold text-maroon">Add-ons</p>
            <div className="mt-2 space-y-2 text-small text-muted">
              <label className="flex items-center gap-2"><input type="checkbox" checked={fallPico} onChange={(e) => setFallPico(e.target.checked)} /> Fall & Pico (+INR 199)</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={stitching} onChange={(e) => setStitching(e.target.checked)} /> Blouse Stitching (+INR 699)</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} /> Premium Gift Wrap (+INR 99)</label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button loading={pending} onClick={() => startTransition(async () => {
              try {
                setError("");
                await addToCart({ productId: product.id, quantity: 1, size, color });
              } catch (err) {
                setError((err as Error).message || "Unable to add item to cart");
              }
            })}>Add to Cart</Button>
            <Button
              variant="secondary"
              loading={pending}
              onClick={() =>
                startTransition(async () => {
                  try {
                    setError("");
                    await addToCart({ productId: product.id, quantity: 1, size, color });
                    window.location.href = withBasePath("/checkout");
                  } catch (err) {
                    setError((err as Error).message || "Unable to continue to checkout");
                  }
                })
              }
            >
              Buy Now
            </Button>
            <WishlistButton productId={product.id} />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <div className="grid gap-3 rounded-2xl border border-border bg-white p-4 text-small text-muted md:grid-cols-2">
            <p><strong className="text-ink">Fabric:</strong> {product.fabric || product.fabricDetails}</p>
            <p><strong className="text-ink">Color Family:</strong> {product.colorFamily}</p>
            <p><strong className="text-ink">Work Type:</strong> {product.workType}</p>
            <p><strong className="text-ink">Weave:</strong> {product.weave}</p>
            <p><strong className="text-ink">Saree Length:</strong> {product.sareeLength}</p>
            <p><strong className="text-ink">Blouse Piece:</strong> {product.blousePieceIncluded ? "Included" : "Not Included"}</p>
            <p className="md:col-span-2"><strong className="text-ink">Wash Care:</strong> {product.washCare || product.care || "Dry clean only"}</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4">
            <h2 className="font-display text-h4 text-maroon">Delivery & Returns</h2>
            <p className="mt-2 text-small text-muted">Ships within 24-48 hours. Free shipping above INR 2999. Easy 3-day return window for damaged/incorrect deliveries.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-white p-5">
        <h2 className="font-display text-h3 text-maroon">Product Description</h2>
        <p className="mt-2 text-body text-muted">{product.description}</p>
      </div>
    </section>
  );
}

