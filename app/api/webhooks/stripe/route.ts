import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isStripeConfigured, stripe } from "@/lib/payments";
import { prisma } from "@/lib/prisma";
import { finalizePaidOrder } from "@/lib/order-utils";
import { sendOrderEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing stripe signature or webhook secret" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const order = await prisma.$transaction(async (tx) => {
          return finalizePaidOrder({
            db: tx as any,
            orderId,
            provider: "STRIPE",
            paymentIntentId: String(session.payment_intent || session.id)
          });
        });

        const user = await prisma.user.findUnique({ where: { id: order.userId } });
        if (user?.email) {
          await sendOrderEmail(user.email, order.id, Number(order.total));
        }
      } catch {
        return NextResponse.json({ error: "Order finalization failed" }, { status: 400 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
