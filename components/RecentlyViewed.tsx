"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";

type Item = {
  id: string;
  title: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  categorySlug: string;
  shortDescription?: string;
  badges?: string[];
};

export function RecentlyViewed({ products }: { products: Item[] }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("labelsaumya:recently-viewed");
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    setIds(parsed);
  }, []);

  const list = products.filter((p) => ids.includes(p.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)).slice(0, 4);
  if (!list.length) return null;

  return (
    <section className="container-page section-space">
      <h2 className="font-display text-h2 text-maroon">Recently Viewed</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

