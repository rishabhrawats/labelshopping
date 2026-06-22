import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured, stripe } from "@/lib/payments";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isStripeConfigured) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
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
    if (order.paymentProvider !== "STRIPE") {
      return NextResponse.json({ error: "Order is not configured for Stripe payment" }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/order/success/${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancelled=true`,
      metadata: {
        orderId: order.id,
        userId: session.user.id
      },
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Order ${order.id.slice(-8).toUpperCase()}`
            },
            unit_amount: Math.round(Number(order.total) * 100)
          },
          quantity: 1
        }
      ]
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: checkoutSession.id }
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout intent failed", error);
    return NextResponse.json({ error: "Unable to initiate Stripe checkout" }, { status: 500 });
  }
}
