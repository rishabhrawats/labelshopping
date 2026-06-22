export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if ((session?.user as any)?.role !== "ADMIN") redirect("/auth/signin");

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/admin/products" className="rounded-xl border border-maroon px-4 py-2 text-sm text-maroon">Products</Link>
        <Link href="/admin/categories" className="rounded-xl border border-maroon px-4 py-2 text-sm text-maroon">Categories</Link>
        <Link href="/admin/orders" className="rounded-xl border border-maroon px-4 py-2 text-sm text-maroon">Orders</Link>
      </div>
      {children}
    </div>
  );
}


