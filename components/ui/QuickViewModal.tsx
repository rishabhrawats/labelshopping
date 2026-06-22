"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { currency } from "@/lib/utils";
import { addToCart } from "@/actions/cartActions";
import { useTransition } from "react";
import { withBasePath } from "@/lib/site";

type QuickViewModalProps = {
  open: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    image: string;
    price: number;
    compareAtPrice?: number | null;
    shortDescription?: string;
  };
};

export function QuickViewModal({ open, onClose, product }: QuickViewModalProps) {
  const [pending, startTransition] = useTransition();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/45 p-4" onClick={onClose}>
      <div className="mx-auto mt-16 max-w-2xl rounded-3xl bg-white p-5 shadow-luxe" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-h3 text-maroon">Quick View</h3>
          <button onClick={onClose} className="rounded-full border border-border p-2 text-maroon hover:bg-surface"><X size={16} /></button>
        </div>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <div className="relative h-64 overflow-hidden rounded-2xl">
            <Image src={withBasePath(product.image)} alt={product.title} fill className="object-cover" />
          </div>
          <div>
            <p className="font-display text-h4 text-ink">{product.title}</p>
            <p className="mt-2 text-maroon font-semibold">{currency(product.price)}</p>
            {product.compareAtPrice ? <p className="text-sm text-muted line-through">{currency(product.compareAtPrice)}</p> : null}
            <p className="mt-3 text-sm text-muted">{product.shortDescription || "Premium saree with elegant drape and artisan-finished detail."}</p>
            <div className="mt-5 flex gap-2">
              <Button loading={pending} onClick={() => startTransition(async () => addToCart({ productId: product.id, quantity: 1 }))}>Add to Cart</Button>
              <Button variant="outline" onClick={onClose}>Continue Shopping</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

