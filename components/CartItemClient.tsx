"use client";

import { useState, useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { removeCartItem, updateCartItemQuantity } from "@/actions/cartActions";
import { currency } from "@/lib/utils";
import { fallbackSareeImage } from "@/lib/product-images";
import { withBasePath } from "@/lib/site";

type CartItemClientProps = {
  item: {
    id: string;
    quantity: number;
    size?: string | null;
    color?: string | null;
    product: {
      title: string;
      price: number;
      images: string[];
      stock: number;
    };
  };
};

export function CartItemClient({ item }: CartItemClientProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <article className="grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-card md:grid-cols-[100px_1fr_auto]">
      <div className="relative h-24 overflow-hidden rounded-xl">
        <Image src={withBasePath(item.product.images[0] || fallbackSareeImage)} alt={item.product.title} fill className="object-cover" sizes="120px" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl text-maroon">{item.product.title}</h3>
        <p className="text-sm text-stone-500">{item.color} | {item.size}</p>
        <p className="text-sm font-semibold">{currency(item.product.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={pending}
          onClick={() => startTransition(async () => {
            try {
              setError("");
              await updateCartItemQuantity(item.id, item.quantity - 1);
            } catch (err) {
              setError((err as Error).message || "Unable to update quantity");
            }
          })}
          className="rounded-lg border border-border p-2 hover:bg-surface"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          disabled={pending || item.quantity >= item.product.stock}
          onClick={() => startTransition(async () => {
            try {
              setError("");
              await updateCartItemQuantity(item.id, item.quantity + 1);
            } catch (err) {
              setError((err as Error).message || "Unable to update quantity");
            }
          })}
          className="rounded-lg border border-border p-2 hover:bg-surface"
        >
          <Plus size={16} />
        </button>
        <button
          disabled={pending}
          onClick={() => startTransition(async () => {
            try {
              setError("");
              await removeCartItem(item.id);
            } catch (err) {
              setError((err as Error).message || "Unable to remove item");
            }
          })}
          className="ml-2 rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {error ? <p className="text-xs text-red-700 md:col-span-3">{error}</p> : null}
    </article>
  );
}

