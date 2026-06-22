import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpayClient } from "@/lib/payments";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }
    const { orderId } = parsed.data;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }
    if (order.paymentProvider !== "RAZORPAY") {
      return NextResponse.json({ error: "Order is not configured for Razorpay payment" }, { status: 400 });
    }

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.total) * 100),
      currency: "INR",
      receipt: order.id,
      notes: {
        userId: session.user.id
      }
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentProvider: "RAZORPAY",
        razorpayOrderId: razorpayOrder.id,
        paymentIntentId: razorpayOrder.id
      }
    });

    return NextResponse.json({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Label Saumya",
      description: `Order ${order.id}`
    });
  } catch (error) {
    console.error("Razorpay order creation failed", error);
    return NextResponse.json({ error: "Unable to initiate Razorpay payment" }, { status: 500 });
  }
}
