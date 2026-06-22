import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { items: true, address: true }
  });

  if (!order) redirect("/account");

  return (
    <div className="container-page py-12">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.12em] text-maroon">Order Confirmed</p>
        <h1 className="mt-2 font-display text-h1 text-maroon">Thank you for shopping Label Saumya</h1>
        <p className="mt-2 text-small text-muted">Order ID: {order.id}</p>
        <p className="text-small text-muted">Payment: {order.paymentStatus}</p>
        <p className="text-small text-muted">Total: {currency(Number(order.total))}</p>
        <div className="mt-6 flex gap-2">
          <Link href="/account"><Button>Track Order</Button></Link>
          <Link href="/collection/all"><Button variant="outline">Continue Shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
