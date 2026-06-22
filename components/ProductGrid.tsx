import { ProductCard } from "@/components/ProductCard";

type ProductLike = {
  id: string;
  title: string;
  images: string[];
  price: number;
  compareAtPrice?: number | null;
  category: { slug: string };
  shortDescription?: string;
  badges?: string[];
};

export function ProductGrid({ products }: { products: ProductLike[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          image={product.images[0]}
          price={Number(product.price)}
          compareAtPrice={product.compareAtPrice ? Number(product.compareAtPrice) : null}
          categorySlug={product.category.slug}
          shortDescription={product.shortDescription}
          badges={product.badges}
        />
      ))}
    </div>
  );
}
