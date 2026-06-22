import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return NextResponse.json({ count: 0 });

  const count = await prisma.cartItem.aggregate({
    where: { userId: session.user.id },
    _sum: { quantity: true }
  });

  return NextResponse.json({ count: count._sum.quantity || 0 });
}
