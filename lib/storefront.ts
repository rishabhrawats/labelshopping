import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const getCategoriesCached = unstable_cache(
  async () => prisma.category.findMany({ orderBy: { name: "asc" } }),
  ["storefront:categories"],
  { revalidate: 300 }
);

const getFeaturedProductsCached = unstable_cache(
  async (limit: number) =>
    prisma.product.findMany({
      where: { OR: [{ featured: true }, { badges: { has: "Festive" } }, { category: { slug: "bridal-sarees" } }] },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: { category: true }
    }),
  ["storefront:featured"],
  { revalidate: 120 }
);

const getNewArrivalsCached = unstable_cache(
  async (limit: number) =>
    prisma.product.findMany({
      where: { isNewArrival: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { category: true }
    }),
  ["storefront:new-arrivals"],
  { revalidate: 120 }
);

const getTrendingCached = unstable_cache(
  async (limit: number) =>
    prisma.product.findMany({
      where: { OR: [{ bestseller: true }, { rating: { gte: 4.5 } }] },
      orderBy: [{ reviewCount: "desc" }, { rating: "desc" }],
      take: limit,
      include: { category: true }
    }),
  ["storefront:trending"],
  { revalidate: 120 }
);

const getProductByIdCached = unstable_cache(
  async (id: string) =>
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" }
        }
      }
    }),
  ["storefront:product-by-id"],
  { revalidate: 120 }
);

const getProductsByCategoryCached = unstable_cache(
  async (slug: string, limit: number) =>
    prisma.product.findMany({
      where: { category: { slug } },
      orderBy: [{ reviewCount: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: { category: true }
    }),
  ["storefront:products-by-category"],
  { revalidate: 120 }
);

const getAllProductsCached = unstable_cache(
  async (limit: number) =>
    prisma.product.findMany({
      orderBy: { sku: "asc" },
      take: limit,
      include: { category: true }
    }),
  ["storefront:all-products"],
  { revalidate: 120 }
);

export async function getCategories() {
  return getCategoriesCached();
}

export async function getFeaturedProducts(limit = 8) {
  return getFeaturedProductsCached(limit);
}

export async function getNewArrivals(limit = 8) {
  return getNewArrivalsCached(limit);
}

export async function getTrending(limit = 8) {
  return getTrendingCached(limit);
}

export async function getProductById(id: string) {
  return getProductByIdCached(id);
}

export async function getProductsByCategory(slug: string, limit = 8) {
  return getProductsByCategoryCached(slug, limit);
}

export async function getAllProducts(limit = 24) {
  return getAllProductsCached(limit);
}
