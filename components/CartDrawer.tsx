"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCartDrawer } from "@/lib/cart-store";

export function CartDrawer() {
  const { open, setOpen } = useCartDrawer();

  return (
    <>
      {open ? <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} /> : null}
      <aside className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-cream p-6 shadow-luxe transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-2xl text-maroon">Your Bag</h3>
          <button onClick={() => setOpen(false)}><X /></button>
        </div>
        <p className="text-sm text-muted">Use quick add from product cards, then proceed to your full cart for checkout.</p>
        <Link href="/cart" onClick={() => setOpen(false)} className="mt-6 inline-block w-full rounded-xl bg-maroon px-4 py-3 text-center text-sm font-semibold text-white hover:bg-deep-maroon">
          Go to Cart
        </Link>
      </aside>
    </>
  );
}

