"use server";

import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addToCartSchema, couponSchema, updateQuantitySchema } from "@/lib/validation";

type AddCartInput = {
  productId: string;
  quantity?: number;
  size?: string;
  color?: string;
};

export async function addToCart(input: AddCartInput) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Please sign in to continue");
  const parsed = addToCartSchema.parse({
    ...input,
    quantity: Number(input.quantity ?? 1)
  });

  const product = await prisma.product.findUnique({ where: { id: parsed.productId } });
  if (!product || product.stock < 1) throw new Error("Product unavailable");

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId_size_color: {
        userId: session.user.id,
        productId: parsed.productId,
        size: parsed.size ?? "",
        color: parsed.color ?? ""
      }
    }
  });
  const nextQty = (existing?.quantity ?? 0) + parsed.quantity;
  if (nextQty > product.stock) throw new Error("Requested quantity exceeds available stock");

  await prisma.cartItem.upsert({
    where: {
      userId_productId_size_color: {
        userId: session.user.id,
        productId: parsed.productId,
        size: parsed.size ?? "",
        color: parsed.color ?? ""
      }
    },
    create: {
      userId: session.user.id,
      productId: parsed.productId,
      quantity: parsed.quantity,
      size: parsed.size ?? "",
      color: parsed.color ?? ""
    },
    update: {
      quantity: {
        increment: parsed.quantity
      }
    }
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const parsed = updateQuantitySchema.parse({ cartItemId, quantity: Number(quantity) });

  if (parsed.quantity <= 0) {
    await removeCartItem(parsed.cartItemId);
    return;
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { id: parsed.cartItemId, userId: session.user.id },
    include: { product: true }
  });
  if (!cartItem) throw new Error("Cart item not found");
  if (parsed.quantity > cartItem.product.stock) throw new Error("Requested quantity exceeds available stock");

  await prisma.cartItem.updateMany({
    where: { id: parsed.cartItemId, userId: session.user.id },
    data: { quantity: parsed.quantity }
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function removeCartItem(cartItemId: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, userId: session.user.id }
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function clearCart() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id }
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function applyCoupon(code: string) {
  const parsed = couponSchema.parse({ code: String(code || "").trim().toUpperCase() });
  const coupon = await prisma.coupon.findUnique({ where: { code: parsed.code } });
  if (!coupon || !coupon.isActive) return null;

  if (coupon.expiresAt && coupon.expiresAt < new Date()) return null;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return null;

  return {
    id: coupon.id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    minOrderValue: Number(coupon.minOrderValue ?? 0),
    maxDiscount: Number(coupon.maxDiscount ?? 0)
  };
}

