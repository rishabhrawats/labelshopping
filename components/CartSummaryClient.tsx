"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { applyCoupon } from "@/actions/cartActions";
import { currency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartSummaryClient({ subtotal, shipping }: { subtotal: number; shipping: number }) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const total = Math.max(0, subtotal + shipping - discount);

  return (
    <aside className="h-fit rounded-2xl border border-border bg-white p-5 shadow-card">
      <h2 className="font-display text-h3 text-maroon">Price Summary</h2>
      <div className="mt-4 space-y-2 text-small">
        <div className="flex justify-between"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : currency(shipping)}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>- {currency(discount)}</span></div>
      </div>

      <div className="mt-4 rounded-xl border border-border p-2">
        <label className="text-xs uppercase tracking-[0.08em] text-muted">Coupon</label>
        <div className="mt-1 flex gap-2">
          <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="ROYAL10" className="flex-1 rounded-lg border border-border px-2 py-1.5 text-sm" />
          <Button variant="outline" loading={pending} onClick={() => startTransition(async () => {
            try {
              setCouponMessage("");
              const data = await applyCoupon(coupon);
              if (!data) {
                setDiscount(0);
                setCouponMessage("Coupon is invalid, expired, or unavailable.");
                return;
              }
              const computed = data.discountType === "PERCENT" ? (subtotal * data.discountValue) / 100 : data.discountValue;
              const amount = data.maxDiscount ? Math.min(computed, data.maxDiscount) : computed;
              setDiscount(Math.min(subtotal, amount));
              setCouponMessage(`Coupon ${data.code} applied.`);
            } catch (error) {
              setCouponMessage((error as Error).message || "Unable to apply coupon");
              setDiscount(0);
            }
          })}>Apply Coupon</Button>
        </div>
        {couponMessage ? <p className="mt-2 text-xs text-muted">{couponMessage}</p> : null}
      </div>

      <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold"><span>Total</span><span>{currency(total)}</span></div>
      <div className="mt-5 grid gap-2">
        <Link href="/checkout"><Button className="w-full">Checkout Securely</Button></Link>
        <Link href="/collection/all"><Button variant="ghost" className="w-full">Continue Shopping</Button></Link>
      </div>
    </aside>
  );
}

