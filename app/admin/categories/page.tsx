export const dynamic = "force-dynamic";
import { deleteCategory, upsertCategory } from "@/actions/orderActions";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-maroon">Manage Categories</h1>

      <form action={upsertCategory} className="grid gap-3 rounded-2xl border border-[#eadfcc] bg-white p-5 shadow-card md:grid-cols-2">
        <input name="name" required placeholder="Category name" className="rounded-xl border p-3 text-sm" />
        <input name="slug" required placeholder="Slug" className="rounded-xl border p-3 text-sm" />
        <input name="image" placeholder="Image URL" className="rounded-xl border p-3 text-sm" />
        <textarea name="description" placeholder="Description" className="rounded-xl border p-3 text-sm" rows={3} />
        <button className="rounded-xl bg-maroon px-4 py-3 text-sm font-semibold text-white">Add Category</button>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((category) => (
          <article key={category.id} className="rounded-2xl border border-[#eadfcc] bg-white p-4 shadow-card">
            <p className="font-display text-2xl text-maroon">{category.name}</p>
            <p className="text-sm text-stone-500">/{category.slug}</p>
            <form action={async () => {
              "use server";
              await deleteCategory(category.id);
            }} className="mt-3">
              <button className="rounded-lg border border-red-200 px-3 py-1 text-red-600">Delete</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}


