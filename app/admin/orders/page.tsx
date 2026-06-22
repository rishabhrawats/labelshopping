export const dynamic = "force-dynamic";
import { updateOrderStatus } from "@/actions/orderActions";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/utils";

const statusOptions = ["PENDING", "CONFIRMED", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "PAYMENT_FAILED"] as const;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true,
      address: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-maroon">Manage Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-[#eadfcc] bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-maroon">Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-stone-600">{order.user.email}</p>
              </div>
              <p className="font-semibold">{currency(Number(order.total))}</p>
            </div>
            <p className="mt-1 text-sm text-stone-600">Payment: {order.paymentProvider} | {order.paymentStatus}</p>
            <p className="text-sm text-stone-600">Items: {order.items.length}</p>
            {order.address ? <p className="mt-1 text-sm text-stone-600">Ship to: {order.address.line1}, {order.address.city}</p> : null}
            <form
              className="mt-3"
              action={async (formData) => {
                "use server";
                await updateOrderStatus(order.id, String(formData.get("status")) as any);
              }}
            >
              <div className="flex items-center gap-3">
                <select name="status" defaultValue={order.status} className="rounded-lg border p-2 text-sm">
                  {statusOptions.map((status) => <option key={status}>{status}</option>)}
                </select>
                <button className="rounded-lg bg-maroon px-3 py-2 text-xs font-semibold text-white">Update</button>
              </div>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}


