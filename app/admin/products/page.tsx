export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/actions/orderActions";
import { AdminProductForm } from "@/components/AdminProductForm";

export default async function AdminProductsPage({ searchParams }: { searchParams?: { edit?: string } }) {
  const editId = searchParams?.edit;
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const editProduct = editId ? await prisma.product.findUnique({ where: { id: editId } }) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-maroon">Manage Products</h1>
        <p className="mt-2 text-sm text-muted">Add new products, upload multiple images, or edit the existing demo catalog.</p>
      </div>

      <AdminProductForm categories={categories} product={editProduct ?? undefined} />

      <div className="overflow-x-auto rounded-2xl border border-[#eadfcc] bg-white shadow-card">
        <div className="border-b border-border p-4">
          <h2 className="font-display text-2xl text-maroon">Product List ({products.length})</h2>
        </div>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-[#f0e7d8]">
                <td className="p-3">{product.title}</td>
                <td className="p-3">{product.category.name}</td>
                <td className="p-3">INR {Number(product.price).toFixed(0)}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <a href={`/admin/products?edit=${product.id}`} className="rounded-lg border border-border px-3 py-1 text-ink">Edit</a>
                    <form action={async () => {
                      "use server";
                      await deleteProduct(product.id);
                    }}>
                      <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


