import Razorpay from "razorpay";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
export const isStripeConfigured = stripeSecret.startsWith("sk_");

export const isRazorpayConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

export const stripe = new Stripe(stripeSecret || "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover"
});

export function getRazorpayClient() {
  if (!isRazorpayConfigured) {
    throw new Error("Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}
