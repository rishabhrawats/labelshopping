"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = { productId: string };

const key = "labelsaumya:wishlist";

export function WishlistButton({ productId }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(key);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    setSaved(ids.includes(productId));
  }, [productId]);

  const toggle = () => {
    const raw = localStorage.getItem(key);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    const next = ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId];
    localStorage.setItem(key, JSON.stringify(next));
    setSaved(next.includes(productId));
  };

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        saved ? "border-maroon bg-maroon text-white" : "border-border bg-white text-maroon hover:bg-surface"
      )}
    >
      <Heart size={16} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

