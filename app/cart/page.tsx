export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CartItemClient } from "@/components/CartItemClient";
import { CartSummaryClient } from "@/components/CartSummaryClient";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default async function CartPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" }
  });

  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const shipping = subtotal >= 2999 ? 0 : 149;

  return (
    <div className="container-page py-10">
      <h1 className="mb-6 font-display text-h1 text-maroon">Your Shopping Bag</h1>
      {!items.length ? (
        <EmptyState
          title="Your cart is empty"
          description="Explore our saree collections and add premium drapes to your cart."
          action={<Link href="/collection/all"><Button>Continue Shopping</Button></Link>}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            {items.map((item) => (
              <CartItemClient
                key={item.id}
                item={{
                  id: item.id,
                  quantity: item.quantity,
                  size: item.size,
                  color: item.color,
                  product: {
                    title: item.product.title,
                    price: Number(item.product.price),
                    images: item.product.images,
                    stock: item.product.stock
                  }
                }}
              />
            ))}
          </section>
          <CartSummaryClient subtotal={subtotal} shipping={shipping} />
        </div>
      )}
    </div>
  );
}

