export const revalidate = 60;

import Link from "next/link";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import { Filters } from "@/components/Filters";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { Pagination } from "@/components/ui/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import { prisma } from "@/lib/prisma";
import { getCollectionContent, getVirtualCollectionWhere, isVirtualCategory, sareeCategories, toLabel } from "@/lib/catalog";
import { heroSareeImage } from "@/lib/product-images";
import { withBasePath } from "@/lib/site";

function parsePrice(range?: string) {
  if (!range) return null;
  const [min, max] = range.split("-").map(Number);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return { min, max };
}

function parseDiscount(value?: string) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const slug = params.slug;
  const sort = searchParams.sort ?? "popular";
  const page = Math.max(1, Number(searchParams.page || 1));
  const take = 24;
  const skip = (page - 1) * take;
  const price = parsePrice(searchParams.price);
  const discount = parseDiscount(searchParams.discount);

  const category = getCollectionContent(slug);
  const virtualWhere = getVirtualCollectionWhere(slug);

  const where: Prisma.ProductWhereInput = {
    ...(slug !== "all" && !isVirtualCategory(slug) ? { category: { slug } } : {}),
    ...(slug === "new-arrivals" ? { isNewArrival: true } : {}),
    ...(slug === "bestsellers" ? { bestseller: true } : {}),
    ...(virtualWhere || {}),
    ...(searchParams.fabric ? { fabric: { contains: toLabel(searchParams.fabric), mode: "insensitive" } } : {}),
    ...(searchParams.color ? { colorFamily: { contains: toLabel(searchParams.color), mode: "insensitive" } } : {}),
    ...(searchParams.occasion ? { occasions: { has: toLabel(searchParams.occasion) } } : {}),
    ...(searchParams.work ? { workType: { contains: toLabel(searchParams.work), mode: "insensitive" } } : {}),
    ...(searchParams.weave ? { weave: { contains: toLabel(searchParams.weave), mode: "insensitive" } } : {}),
    ...(searchParams.ready ? { readyToShip: true } : {}),
    ...(searchParams.availability === "in stock" ? { stock: { gt: 0 } } : {}),
    ...(searchParams.q ? {
      OR: [
        { title: { contains: searchParams.q, mode: "insensitive" } },
        { shortDescription: { contains: searchParams.q, mode: "insensitive" } },
        { fabric: { contains: searchParams.q, mode: "insensitive" } },
        { category: { name: { contains: searchParams.q, mode: "insensitive" } } }
      ]
    } : {}),
    ...(price ? {
      price: { gte: price.min, lte: price.max }
    } : {}),
    ...(discount ? {
      AND: [
        { compareAtPrice: { not: null } },
        {
          OR: [{ badges: { has: `${discount}% OFF` } }]
        }
      ]
    } : {})
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "low-high"
      ? { price: "asc" }
      : sort === "high-low"
        ? { price: "desc" }
        : sort === "newest"
          ? { createdAt: "desc" }
          : { reviewCount: "desc" };

  const products = await prisma.product.findMany({ where, orderBy, include: { category: true }, skip, take });
  const total = await prisma.product.count({ where });

  const totalPages = Math.max(1, Math.ceil(total / take));
  const prevParams = new URLSearchParams();
  const nextParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v) {
      prevParams.set(k, v);
      nextParams.set(k, v);
    }
  });
  prevParams.set("page", String(Math.max(1, page - 1)));
  nextParams.set("page", String(Math.min(totalPages, page + 1)));

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collection/all" }, { label: category?.name || toLabel(slug) }]} />
      <div className="mt-4 grid gap-4 rounded-3xl border border-border bg-white p-4 md:grid-cols-[1fr_240px] md:p-6">
        <div>
          <h1 className="font-display text-h1 text-maroon">{category?.name || (slug === "all" ? "All Sarees" : toLabel(slug))}</h1>
          <p className="mt-2 text-body text-muted">{category?.hero || "Premium saree curation across fabric, weave, and occasion with luxury-grade finishing."}</p>
        </div>
        <div className="relative h-44 overflow-hidden rounded-2xl border border-border">
          <Image
            src={withBasePath(category?.heroImage || heroSareeImage)}
            alt={`${category?.name || "Saree"} hero`}
            fill
            className="object-cover"
            sizes="240px"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {sareeCategories.slice(0, 10).map((chip) => (
          <FilterChip
            key={chip.slug}
            href={`/collection/${chip.slug}`}
            label={chip.name.replace(" Sarees", "")}
            active={chip.slug === slug}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <SectionHeader title={`${total} Sarees`} description={searchParams.q ? `Search: ${searchParams.q}` : "Handpicked luxury sarees"} />
        <SortDropdown value={sort} />
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Filters />
        <section>
          {products.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

              <Pagination
                page={page}
                totalPages={totalPages}
                prevHref={page > 1 ? `?${prevParams.toString()}` : undefined}
                nextHref={page < totalPages ? `?${nextParams.toString()}` : undefined}
              />
            </>
          ) : (
            <EmptyState
              title="No Sarees Match Your Filters"
              description="Try broadening your fabric, weave, or price range to discover more styles."
              action={<Link href={`/collection/${slug}`}><Button variant="outline">Clear Filters</Button></Link>}
            />
          )}
        </section>
      </div>
    </div>
  );
}

