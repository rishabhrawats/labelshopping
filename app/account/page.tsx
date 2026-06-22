export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/utils";
import { deleteAddress, setDefaultAddress, upsertAddress, updateProfile } from "@/actions/orderActions";
import { AccountLogoutButton } from "@/components/AccountLogoutButton";

export default async function AccountPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const orders = await prisma.order.findMany({ where: { userId: session.user.id }, include: { items: true }, orderBy: { createdAt: "desc" } });
  const addresses = await prisma.address.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="container-page space-y-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-maroon">My Account</h1>
        <AccountLogoutButton />
      </div>

      <section className="rounded-2xl border border-[#eadfcc] bg-white p-6 shadow-card">
        <h2 className="font-display text-2xl text-maroon">Profile</h2>
        <form action={updateProfile} className="mt-4 grid gap-3 md:grid-cols-2">
          <input defaultValue={user?.name ?? ""} name="name" placeholder="Name" className="rounded-xl border p-3 text-sm" />
          <input defaultValue={user?.phone ?? ""} name="phone" placeholder="Phone" className="rounded-xl border p-3 text-sm" />
          <button className="rounded-xl bg-maroon px-4 py-3 text-sm font-medium text-white md:col-span-2">Save Profile</button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#eadfcc] bg-white p-6 shadow-card">
        <h2 className="font-display text-2xl text-maroon">Address Book</h2>
        <form action={upsertAddress} className="mt-4 grid gap-3 md:grid-cols-2">
          <input required name="fullName" placeholder="Full name" className="rounded-xl border p-3 text-sm" />
          <input required name="phone" placeholder="Phone" className="rounded-xl border p-3 text-sm" />
          <input required name="line1" placeholder="Address line 1" className="rounded-xl border p-3 text-sm md:col-span-2" />
          <input name="line2" placeholder="Address line 2" className="rounded-xl border p-3 text-sm md:col-span-2" />
          <input required name="city" placeholder="City" className="rounded-xl border p-3 text-sm" />
          <input required name="state" placeholder="State" className="rounded-xl border p-3 text-sm" />
          <input required name="postalCode" placeholder="Postal code" className="rounded-xl border p-3 text-sm" />
          <input name="country" defaultValue="India" placeholder="Country" className="rounded-xl border p-3 text-sm" />
          <button className="rounded-xl bg-maroon px-4 py-3 text-sm font-medium text-white md:col-span-2">Save Address</button>
        </form>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {addresses.map((address) => (
            <article key={address.id} className="rounded-xl border border-[#eadfcc] p-4 text-sm">
              <p className="font-semibold text-maroon">{address.fullName}</p>
              <p>{address.line1}</p>
              <p>{address.city}, {address.state} {address.postalCode}</p>
              <p>{address.phone}</p>
              <div className="mt-3 flex gap-2">
                <form action={async () => {
                  "use server";
                  await setDefaultAddress(address.id);
                }}>
                  <button className="rounded-lg border border-border px-3 py-1.5 text-xs">
                    {address.isDefault ? "Default Address" : "Set as Default"}
                  </button>
                </form>
                <form action={async () => {
                  "use server";
                  await deleteAddress(address.id);
                }}>
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700">Delete</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#eadfcc] bg-white p-6 shadow-card">
        <h2 className="font-display text-2xl text-maroon">Orders</h2>
        <div className="mt-4 space-y-3">
          {orders.length ? orders.map((order) => (
            <article key={order.id} className="rounded-xl border border-[#eadfcc] p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-maroon">Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="uppercase tracking-wide text-stone-500">{order.status}</p>
              </div>
              <p className="mt-1 text-stone-600">Payment: {order.paymentProvider} | {order.paymentStatus}</p>
              <p className="mt-1 font-medium">Total: {currency(Number(order.total))}</p>
            </article>
          )) : <p className="text-sm text-stone-500">No orders yet.</p>}
        </div>
      </section>
    </div>
  );
}


