import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { finalizePaidOrder } from "@/lib/order-utils";

const schema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay is not configured" }, { status: 503 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment verification payload" }, { status: 400 });
    }
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generated !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } });
    if (!order || order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await finalizePaidOrder({
        db: tx as any,
        orderId,
        provider: "RAZORPAY",
        paymentIntentId: razorpayOrderId,
        razorpayPaymentId
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay verification failed", error);
    return NextResponse.json({ error: (error as Error).message || "Payment confirmation failed" }, { status: 400 });
  }
}
