"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useState, useTransition } from "react";
import { addToCart } from "@/actions/cartActions";
import { currency } from "@/lib/utils";
import { fallbackSareeImage } from "@/lib/product-images";
import { withBasePath } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { QuickViewModal } from "@/components/ui/QuickViewModal";

type ProductCardProps = {
  id: string;
  title: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  categorySlug: string;
  shortDescription?: string;
  badges?: string[];
};

export function ProductCard({ id, title, image, price, compareAtPrice, categorySlug, shortDescription, badges = [] }: ProductCardProps) {
  const [pending, startTransition] = useTransition();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(withBasePath(image || fallbackSareeImage));
  const [error, setError] = useState("");
  const discount = compareAtPrice && compareAtPrice > price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <>
      <motion.article whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        <div className="relative block aspect-[2/3] overflow-hidden bg-[#f8f5f2]">
          <Link href={`/product/${id}`}>
            <Image src={imgSrc} alt={title} fill onError={() => setImgSrc(withBasePath(fallbackSareeImage))} className="object-cover object-top transition duration-500 group-hover:scale-[1.025]" sizes="(max-width: 768px) 100vw, 25vw" />
          </Link>
          <div className="absolute left-3 top-3 flex gap-2">
            {discount > 0 ? <Badge>{discount}% OFF</Badge> : null}
            {badges.slice(0, 1).map((badge) => <Badge key={badge}>{badge}</Badge>)}
          </div>
          <div className="absolute right-3 top-3"><WishlistButton productId={id} /></div>
          <button onClick={() => setQuickViewOpen(true)} className="absolute bottom-3 right-3 inline-flex translate-y-1 items-center gap-1 rounded-full border border-border bg-white/95 px-3 py-1.5 text-xs font-semibold text-maroon opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100">
            <Eye size={14} /> Quick View
          </button>
        </div>

        <div className="space-y-3 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">{categorySlug.replaceAll("-", " ")}</p>
          <h3 className="line-clamp-2 font-display text-h4 text-ink">{title}</h3>
          <p className="line-clamp-2 text-small text-muted">{shortDescription || "Premium saree crafted with elegant drape and refined finish."}</p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-maroon">{currency(price)}</span>
            {compareAtPrice ? <span className="text-sm text-muted line-through">{currency(compareAtPrice)}</span> : null}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button loading={pending} onClick={() => startTransition(async () => {
              try {
                setError("");
                await addToCart({ productId: id, quantity: 1 });
              } catch (err) {
                setError((err as Error).message || "Unable to add to cart");
              }
            })}>Add to Cart</Button>
            <Link href={`/product/${id}`}><Button variant="outline" className="w-full">View Details</Button></Link>
          </div>
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </div>
      </motion.article>

      <QuickViewModal
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={{ id, title, image: imgSrc, price, compareAtPrice, shortDescription }}
      />
    </>
  );
}

