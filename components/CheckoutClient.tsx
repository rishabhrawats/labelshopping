"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { createOrder } from "@/actions/orderActions";
import { withBasePath } from "@/lib/site";
import { currency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = "COD" | "STRIPE" | "RAZORPAY";

type CheckoutClientProps = {
  subtotal: number;
  shipping: number;
  availablePaymentMethods: PaymentMethod[];
  savedAddresses: Array<{
    id: string;
    fullName: string;
    phone: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
};

export function CheckoutClient({ subtotal, shipping, availablePaymentMethods, savedAddresses }: CheckoutClientProps) {
  const defaultPaymentMethod = availablePaymentMethods.includes("COD") ? "COD" : availablePaymentMethods[0];
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(defaultPaymentMethod);
  const [shippingMethod, setShippingMethod] = useState<"STANDARD" | "EXPRESS">("STANDARD");
  const [couponCode, setCouponCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const calculatedShipping = useMemo(() => (shippingMethod === "EXPRESS" ? shipping + 199 : shipping), [shippingMethod, shipping]);
  const total = useMemo(() => subtotal + calculatedShipping, [subtotal, calculatedShipping]);
  const selectedAddress = useMemo(
    () => savedAddresses.find((address) => address.id === selectedAddressId),
    [savedAddresses, selectedAddressId]
  );

  const loadRazorpay = async () => {
    if (window.Razorpay) return true;
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        setError("");
        const order = await createOrder({
          requestId: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `req-${Date.now()}`,
          addressId: selectedAddressId || undefined,
          address: {
            fullName: String(formData.get("fullName")),
            phone: String(formData.get("phone")),
            line1: String(formData.get("line1")),
            line2: String(formData.get("line2") || ""),
            city: String(formData.get("city")),
            state: String(formData.get("state")),
            postalCode: String(formData.get("postalCode")),
            country: "India"
          },
          shippingCharge: calculatedShipping,
          paymentProvider: paymentMethod,
          couponCode: couponCode || undefined,
          notes: String(formData.get("notes") || "")
        });

        if (paymentMethod === "COD") {
          window.location.href = withBasePath(`/order/success/${order.id}`);
          return;
        }

        if (paymentMethod === "STRIPE") {
          const response = await fetch(withBasePath("/api/checkout/create-intent"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order.id })
          });

          const data = await response.json();
          if (data.url) {
            window.location.href = data.url;
            return;
          }

          setError(data.error || "Unable to initiate Stripe checkout.");
          return;
        }

        const loaded = await loadRazorpay();
        if (!loaded) {
          setError("Unable to load Razorpay SDK.");
          return;
        }

        const orderRes = await fetch(withBasePath("/api/checkout/razorpay-order"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id })
        });
        const rData = await orderRes.json();
        if (rData.error) {
          setError(rData.error);
          return;
        }

        const rzp = new window.Razorpay({
          key: rData.key,
          amount: rData.amount,
          currency: rData.currency,
          name: rData.name,
          description: rData.description,
          order_id: rData.razorpayOrderId,
          handler: async function (response: any) {
            const verify = await fetch(withBasePath("/api/checkout/verify-razorpay"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });
            if (!verify.ok) {
              setError("Payment verification failed. Please contact support.");
              return;
            }
            window.location.href = withBasePath(`/order/success/${order.id}`);
          },
          prefill: {
            name: String(formData.get("fullName")),
            contact: String(formData.get("phone"))
          },
          theme: { color: "#5A1625" }
        });

        rzp.open();
      } catch (err) {
        setError((err as Error).message || "Checkout failed. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-[1fr_360px]">
      <section className="space-y-4 rounded-2xl border border-border bg-white p-5 shadow-card">
        <h2 className="font-display text-h3 text-maroon">Shipping Address</h2>
        <div key={selectedAddressId || "new-address"} className="grid gap-3 md:grid-cols-2">
          {savedAddresses.length ? (
            <select
              value={selectedAddressId}
              onChange={(event) => setSelectedAddressId(event.target.value)}
              className="rounded-lg border border-border p-3 text-sm md:col-span-2"
            >
              {savedAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.fullName} - {address.line1}, {address.city}
                </option>
              ))}
              <option value="">Use a new address</option>
            </select>
          ) : null}
          <input required name="fullName" defaultValue={selectedAddress?.fullName || ""} placeholder="Full Name" className="rounded-lg border border-border p-3 text-sm" />
          <input required name="phone" defaultValue={selectedAddress?.phone || ""} placeholder="Phone" className="rounded-lg border border-border p-3 text-sm" />
          <input required name="line1" defaultValue={selectedAddress?.line1 || ""} placeholder="Address Line 1" className="rounded-lg border border-border p-3 text-sm md:col-span-2" />
          <input name="line2" defaultValue={selectedAddress?.line2 || ""} placeholder="Address Line 2" className="rounded-lg border border-border p-3 text-sm md:col-span-2" />
          <input required name="city" defaultValue={selectedAddress?.city || ""} placeholder="City" className="rounded-lg border border-border p-3 text-sm" />
          <input required name="state" defaultValue={selectedAddress?.state || ""} placeholder="State" className="rounded-lg border border-border p-3 text-sm" />
          <input required name="postalCode" defaultValue={selectedAddress?.postalCode || ""} placeholder="Pincode" className="rounded-lg border border-border p-3 text-sm" />
          <textarea name="notes" placeholder="Order notes (optional)" className="rounded-lg border border-border p-3 text-sm md:col-span-2" rows={3} />
        </div>

        <h3 className="pt-2 font-display text-h4 text-maroon">Payment Method</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {availablePaymentMethods.map((method) => (
            <label key={method} className={`cursor-pointer rounded-lg border p-3 text-center text-sm ${paymentMethod === method ? "border-maroon bg-surface" : "border-border"}`}>
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="sr-only"
              />
              {method}
            </label>
          ))}
        </div>

        <h3 className="pt-2 font-display text-h4 text-maroon">Shipping Method</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <label className={`cursor-pointer rounded-lg border p-3 text-center text-sm ${shippingMethod === "STANDARD" ? "border-maroon bg-surface" : "border-border"}`}>
            <input type="radio" checked={shippingMethod === "STANDARD"} onChange={() => setShippingMethod("STANDARD")} className="sr-only" />
            Standard Delivery (3-6 days)
          </label>
          <label className={`cursor-pointer rounded-lg border p-3 text-center text-sm ${shippingMethod === "EXPRESS" ? "border-maroon bg-surface" : "border-border"}`}>
            <input type="radio" checked={shippingMethod === "EXPRESS"} onChange={() => setShippingMethod("EXPRESS")} className="sr-only" />
            Express Delivery (1-2 days)
          </label>
        </div>
      </section>

      <aside className="h-fit space-y-3 rounded-2xl border border-border bg-white p-5 shadow-card">
        <h3 className="font-display text-h4 text-maroon">Order Summary</h3>
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span>Shipping</span><span>{currency(calculatedShipping)}</span></div>
        <div className="rounded-lg border border-border p-2">
          <label className="text-xs text-muted">Coupon</label>
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="ROYAL10"
          />
        </div>
        <div className="flex justify-between border-t pt-3 font-semibold"><span>Total</span><span>{currency(total)}</span></div>
        <Button disabled={pending} className="w-full">{pending ? "Processing..." : "Checkout Securely"}</Button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </aside>
    </form>
  );
}
