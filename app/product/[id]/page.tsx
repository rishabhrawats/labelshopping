export const revalidate = 120;

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ProductCard } from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
      category: true
    }
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    take: 8
  });
  const recentPool = await prisma.product.findMany({ include: { category: true }, take: 20, orderBy: { updatedAt: "desc" } });

  return (
    <div className="pb-14">
      <ProductDetailClient
        product={{
          id: product.id,
          title: product.title,
          categoryName: product.category.name,
          categorySlug: product.category.slug,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          images: product.images,
          sizes: product.sizes,
          colors: product.colors,
          description: product.description,
          shortDescription: product.shortDescription,
          fabricDetails: product.fabricDetails,
          fabric: product.fabric,
          colorFamily: product.colorFamily,
          workType: product.workType,
          weave: product.weave,
          sareeLength: product.sareeLength,
          blousePieceIncluded: product.blousePieceIncluded,
          washCare: product.washCare,
          care: product.care,
          stock: product.stock,
          badges: product.badges,
          rating: product.rating,
          reviewCount: product.reviewCount,
          readyToShip: product.readyToShip
        }}
      />

      <section className="container-page section-space">
        <SectionHeader title="Customer Reviews" description="Trusted buyer feedback from real purchases." />
        <div className="space-y-3">
          {product.reviews.length ? product.reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="font-semibold text-maroon">{review.user.name}</p>
              <p className="text-sm text-muted">Rating: {review.rating}/5</p>
              <p className="mt-2 text-small text-ink">{review.comment}</p>
            </article>
          )) : <EmptyState title="No Reviews Yet" description="Be the first to review this saree after your purchase." />}
        </div>
      </section>

      <section className="container-page section-space">
        <SectionHeader title="Related Sarees" description="Similar drapes from this collection." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.images[0]}
              price={Number(item.price)}
              compareAtPrice={item.compareAtPrice ? Number(item.compareAtPrice) : null}
              categorySlug={item.category.slug}
              shortDescription={item.shortDescription}
              badges={item.badges}
            />
          ))}
        </div>
      </section>

      <RecentlyViewed
        products={recentPool.map((item) => ({
          id: item.id,
          title: item.title,
          image: item.images[0],
          price: Number(item.price),
          compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : null,
          categorySlug: item.category.slug,
          shortDescription: item.shortDescription,
          badges: item.badges
        }))}
      />
    </div>
  );
}

