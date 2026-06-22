"use server";

import { PaymentProvider, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/email";
import { addressSchema, checkoutSchema } from "@/lib/validation";
import { calculateDiscount, finalizePaidOrder, toCouponPreview } from "@/lib/order-utils";

type AddressInput = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
};

type CheckoutInput = {
  requestId: string;
  addressId?: string;
  address: AddressInput;
  shippingCharge: number;
  paymentProvider: PaymentProvider;
  couponCode?: string;
  notes?: string;
};

export async function createOrder(input: CheckoutInput) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const parsed = checkoutSchema.parse(input);

  const duplicate = await prisma.order.findUnique({
    where: { requestId: parsed.requestId }
  });
  if (duplicate && duplicate.userId !== session.user.id) {
    throw new Error("Invalid checkout request");
  }
  if (duplicate) return duplicate;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true }
  });

  if (!cartItems.length) throw new Error("Cart is empty");
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      throw new Error(`Only ${item.product.stock} left for ${item.product.title}`);
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  const coupon = parsed.couponCode
    ? await prisma.coupon.findUnique({ where: { code: parsed.couponCode.toUpperCase() } })
    : null;
  if (coupon && (!coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date()))) {
    throw new Error("Coupon is invalid or expired");
  }
  if (coupon && coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  const discount = calculateDiscount(subtotal, toCouponPreview(coupon));
  if (coupon?.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
    throw new Error(`Coupon valid on orders above INR ${Number(coupon.minOrderValue)}`);
  }

  const total = subtotal - discount + parsed.shippingCharge;

  let result;
  try {
    result = await prisma.$transaction(async (tx) => {
      const address = parsed.addressId
        ? await tx.address.findFirst({
            where: { id: parsed.addressId, userId: session.user.id }
          })
        : null;
      if (parsed.addressId && !address) {
        throw new Error("Selected address no longer exists");
      }

      const shippingAddress =
        address ||
        (await tx.address.create({
          data: {
            userId: session.user.id,
            fullName: parsed.address.fullName,
            phone: parsed.address.phone,
            line1: parsed.address.line1,
            line2: parsed.address.line2,
            city: parsed.address.city,
            state: parsed.address.state,
            postalCode: parsed.address.postalCode,
            country: parsed.address.country ?? "India"
          }
        }));

      const order = await tx.order.create({
        data: {
          requestId: parsed.requestId,
          userId: session.user.id,
          addressId: shippingAddress.id,
          subtotal,
          discount,
          shipping: parsed.shippingCharge,
          total,
          paymentProvider: parsed.paymentProvider,
          couponId: coupon?.id,
          couponCode: coupon?.code,
          notes: parsed.notes,
          status: parsed.paymentProvider === "COD" ? "CONFIRMED" : "PENDING",
          paymentStatus: parsed.paymentProvider === "COD" ? "cod_pending" : "initiated",
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productTitle: item.product.title,
              productImage: item.product.images[0],
              quantity: item.quantity,
              price: item.product.price,
              size: item.size,
              color: item.color
            }))
          }
        }
      });

      if (parsed.paymentProvider === "COD") {
        for (const item of cartItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      if (coupon && parsed.paymentProvider === "COD") {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }

      await tx.cartItem.deleteMany({ where: { userId: session.user.id } });
      return order;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await prisma.order.findUnique({ where: { requestId: parsed.requestId } });
      if (existing && existing.userId === session.user.id) return existing;
    }
    throw error;
  }

  if (session.user.email && parsed.paymentProvider === "COD") {
    await sendOrderEmail(session.user.email, result.id, Number(result.total));
  }

  revalidatePath("/account");
  revalidatePath("/admin/orders");
  return result;
}

export async function markOrderPaid(
  orderId: string,
  provider: PaymentProvider,
  paymentIntentId: string,
  razorpayPaymentId?: string
) {
  await prisma.$transaction(async (tx) => {
    await finalizePaidOrder({
      db: tx as any,
      orderId,
      provider,
      paymentIntentId,
      razorpayPaymentId
    });
  });

  revalidatePath("/account");
  revalidatePath("/admin/orders");
}

export async function updateProfile(formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 15);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone }
  });

  revalidatePath("/account");
}

export async function upsertAddress(formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const parsed = addressSchema.parse({
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    line1: String(formData.get("line1") ?? ""),
    line2: String(formData.get("line2") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
    country: String(formData.get("country") ?? "India")
  });

  await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName: parsed.fullName,
      phone: parsed.phone,
      line1: parsed.line1,
      line2: parsed.line2,
      city: parsed.city,
      state: parsed.state,
      postalCode: parsed.postalCode,
      country: parsed.country
    }
  });

  revalidatePath("/account");
  revalidatePath("/checkout");
}

export async function setDefaultAddress(addressId: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const address = await prisma.address.findFirst({ where: { id: addressId, userId: session.user.id } });
  if (!address) throw new Error("Address not found");

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: session.user.id, isDefault: true },
      data: { isDefault: false }
    }),
    prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    })
  ]);

  revalidatePath("/account");
  revalidatePath("/checkout");
}

export async function deleteAddress(addressId: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.address.deleteMany({
    where: { id: addressId, userId: session.user.id }
  });

  revalidatePath("/account");
  revalidatePath("/checkout");
}

export async function upsertCategory(formData: FormData) {
  const session = await getServerAuthSession();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Forbidden");

  const id = String(formData.get("id") || "");
  const data = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
    image: String(formData.get("image") || "")
  };
  if (!data.name || !/^[a-z0-9-]+$/.test(data.slug)) throw new Error("Invalid category data");

  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  const session = await getServerAuthSession();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export async function upsertProduct(formData: FormData) {
  const session = await getServerAuthSession();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Forbidden");

  const id = String(formData.get("id") || "");
  const payload: Prisma.ProductUncheckedCreateInput = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    shortDescription: String(formData.get("shortDescription") || ""),
    description: String(formData.get("description") || ""),
    fabricDetails: String(formData.get("fabricDetails") || ""),
    fabric: String(formData.get("fabric") || ""),
    colorFamily: String(formData.get("colorFamily") || ""),
    workType: String(formData.get("workType") || ""),
    weave: String(formData.get("weave") || ""),
    sareeLength: String(formData.get("sareeLength") || "5.5 meters"),
    blousePieceIncluded: String(formData.get("blousePieceIncluded") || "true") !== "false",
    washCare: String(formData.get("washCare") || "Dry clean recommended"),
    care: String(formData.get("care") || ""),
    price: new Prisma.Decimal(String(formData.get("price") || "0")),
    compareAtPrice: formData.get("compareAtPrice")
      ? new Prisma.Decimal(String(formData.get("compareAtPrice")))
      : undefined,
    stock: Number(formData.get("stock") || 0),
    sku: String(formData.get("sku") || ""),
    colors: String(formData.get("colors") || "").split(",").map((v) => v.trim()).filter(Boolean),
    sizes: String(formData.get("sizes") || "").split(",").map((v) => v.trim()).filter(Boolean),
    occasions: String(formData.get("occasions") || "").split(",").map((v) => v.trim()).filter(Boolean),
    featured: String(formData.get("featured") || "false") === "true",
    bestseller: String(formData.get("bestseller") || "false") === "true",
    isNewArrival: String(formData.get("isNewArrival") || "false") === "true",
    readyToShip: String(formData.get("readyToShip") || "false") === "true",
    availability: Number(formData.get("stock") || 0) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
    rating: Number(formData.get("rating") || 4.2),
    reviewCount: Number(formData.get("reviewCount") || 0),
    badges: String(formData.get("badges") || "").split(",").map((v) => v.trim()).filter(Boolean),
    images: String(formData.get("images") || "").split(",").map((v) => v.trim()).filter(Boolean),
    categoryId: String(formData.get("categoryId") || "")
  };
  if (!payload.title || !payload.slug || !payload.sku || !payload.categoryId) throw new Error("Missing required product fields");
  if (!/^[a-z0-9-]+$/.test(payload.slug)) throw new Error("Product slug must be lowercase kebab-case");
  if (Number(payload.price) <= 0) throw new Error("Price must be greater than zero");

  if (id) {
    await prisma.product.update({ where: { id }, data: payload });
  } else {
    await prisma.product.create({ data: payload });
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/collection/all");
}

export async function deleteProduct(id: string) {
  const session = await getServerAuthSession();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/collection/all");
}

export async function updateOrderStatus(orderId: string, status: "PENDING" | "CONFIRMED" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "PAYMENT_FAILED") {
  const session = await getServerAuthSession();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
}

