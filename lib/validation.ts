import { PaymentProvider } from "@prisma/client";
import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20).default(1),
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional()
});

export const updateQuantitySchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.number().int().min(0).max(20)
});

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character")
});

export const addressSchema = z.object({
  fullName: z.string().min(2).max(80),
  phone: z.string().min(8).max(15),
  line1: z.string().min(5).max(150),
  line2: z.string().max(150).optional(),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  postalCode: z.string().min(4).max(12),
  country: z.string().min(2).max(60).optional()
});

export const checkoutSchema = z.object({
  requestId: z.string().min(8).max(120),
  addressId: z.string().min(1).optional(),
  address: addressSchema,
  shippingCharge: z.number().min(0).max(1000),
  paymentProvider: z.nativeEnum(PaymentProvider),
  couponCode: z.string().max(30).optional(),
  notes: z.string().max(300).optional()
});

export const couponSchema = z.object({
  code: z.string().min(2).max(30)
});
