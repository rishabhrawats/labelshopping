import { Coupon, PaymentProvider, Prisma, PrismaClient } from "@prisma/client";

export type CouponPreview = {
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
};

export function calculateDiscount(subtotal: number, coupon: CouponPreview | null) {
  if (!coupon) return 0;
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) return 0;

  let discount = coupon.discountType === "PERCENT" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

  return Math.min(discount, subtotal);
}

export function toCouponPreview(coupon: Coupon | null): CouponPreview | null {
  if (!coupon) return null;
  return {
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    minOrderValue: Number(coupon.minOrderValue ?? 0),
    maxDiscount: Number(coupon.maxDiscount ?? 0)
  };
}

export async function finalizePaidOrder(params: {
  db: PrismaClient | Prisma.TransactionClient;
  orderId: string;
  provider: PaymentProvider;
  paymentIntentId: string;
  razorpayPaymentId?: string;
}) {
  const order = await params.db.order.findUnique({
    where: { id: params.orderId },
    include: { items: true }
  });

  if (!order) throw new Error("Order not found");
  if (order.paymentStatus === "paid") return order;

  for (const item of order.items) {
    const product = await params.db.product.findUnique({ where: { id: item.productId } });
    if (!product || product.stock < item.quantity) {
      await params.db.order.update({
        where: { id: order.id },
        data: {
          status: "PAYMENT_FAILED",
          paymentStatus: "failed",
          paymentFailureReason: "Insufficient stock at payment confirmation"
        }
      });
      throw new Error(`Insufficient stock for ${item.productTitle}`);
    }
  }

  for (const item of order.items) {
    await params.db.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } }
    });
  }

  if (order.couponId) {
    await params.db.coupon.update({
      where: { id: order.couponId },
      data: { usedCount: { increment: 1 } }
    });
  }

  return params.db.order.update({
    where: { id: order.id },
    data: {
      paymentProvider: params.provider,
      paymentStatus: "paid",
      status: "PAID",
      paymentIntentId: params.paymentIntentId,
      razorpayPaymentId: params.razorpayPaymentId
    }
  });
}
