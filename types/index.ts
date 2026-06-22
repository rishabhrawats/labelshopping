export type CartSummary = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

export type PaymentChoice = "COD" | "STRIPE" | "RAZORPAY";
