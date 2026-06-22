import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { getCategoryImages } from "@/lib/product-images";

const prisma = new PrismaClient();

const categories = [
  { name: "New Arrivals", slug: "new-arrivals", description: "Latest saree drops curated every week." },
  { name: "Bestsellers", slug: "bestsellers", description: "Most loved sarees across occasions." },
  { name: "Kanjivaram Sarees", slug: "kanjivaram-sarees", description: "Rich silk drapes with heritage zari detailing." },
  { name: "Banarasi Sarees", slug: "banarasi-sarees", description: "Classic Banarasi weave with regal motifs." },
  { name: "Linen Sarees", slug: "linen-sarees", description: "Lightweight breathable sarees for elegant daywear." },
  { name: "Cotton Sarees", slug: "cotton-sarees", description: "Soft cotton sarees for comfort and grace." },
  { name: "Tussar Sarees", slug: "tussar-sarees", description: "Natural-texture tussar styles with artisanal charm." },
  { name: "Silk Sarees", slug: "silk-sarees", description: "Premium silk sarees from festive to bridal edits." },
  { name: "Organza Sarees", slug: "organza-sarees", description: "Feather-light organza with statement styling." },
  { name: "Chiffon Sarees", slug: "chiffon-sarees", description: "Flowy chiffon sarees with graceful movement." },
  { name: "Georgette Sarees", slug: "georgette-sarees", description: "Soft georgette sarees with flattering fall." },
  { name: "Handloom Sarees", slug: "handloom-sarees", description: "Handwoven sarees celebrating Indian craft clusters." },
  { name: "Printed Sarees", slug: "printed-sarees", description: "Artful prints in elevated saree silhouettes." },
  { name: "Embroidered Sarees", slug: "embroidered-sarees", description: "Intricate embroidery sarees for occasions." },
  { name: "Bridal Sarees", slug: "bridal-sarees", description: "Curated bridal sarees in deep jewel tones." },
  { name: "Festive Sarees", slug: "festive-sarees", description: "Festive edits with zari and celebratory accents." },
  { name: "Party Wear Sarees", slug: "party-wear-sarees", description: "Modern party sarees with statement glam." },
  { name: "Daily Wear Sarees", slug: "daily-wear-sarees", description: "Daily essentials balancing comfort and style." }
];

const colors = ["Maroon", "Wine", "Ivory", "Gold", "Emerald", "Indigo", "Rose", "Beige", "Black", "Navy", "Pink", "Mustard"];
const fabrics = ["Pure Silk", "Soft Silk", "Kanjivaram Silk", "Banarasi Silk", "Linen", "Cotton", "Tussar", "Organza", "Chiffon", "Georgette", "Handloom Cotton"];
const workTypes = ["Zari Work", "Temple Border", "Embroidered", "Printed", "Woven Motifs", "Handloom", "Minimal"];
const weaves = ["Kanjivaram", "Banarasi", "Jamdani", "Tussar Weave", "Chanderi", "Plain Weave", "Jacquard"];
const occasions = ["Wedding", "Festive", "Party", "Office", "Casual", "Daily Wear"];
const adjectives = ["Royal", "Regal", "Heritage", "Signature", "Radiant", "Elegant", "Classic", "Timeless", "Opulent", "Premium"];
const descriptors = ["Zari", "Temple Border", "Handloom", "Woven", "Printed", "Embroidered", "Festive", "Bridal", "Party Wear", "Daily Elegance"];

function pick<T>(arr: T[], index: number) {
  return arr[index % arr.length];
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function priceBand(categorySlug: string, index: number) {
  if (categorySlug === "bridal-sarees" || categorySlug === "kanjivaram-sarees") return 12000 + (index % 8) * 1800;
  if (categorySlug === "banarasi-sarees" || categorySlug === "silk-sarees") return 7000 + (index % 9) * 1100;
  if (categorySlug === "daily-wear-sarees" || categorySlug === "cotton-sarees") return 1499 + (index % 8) * 350;
  return 2499 + (index % 10) * 620;
}

async function seed() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();

  const adminPassword = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@labelsaumya.com" },
    update: { role: "ADMIN", passwordHash: adminPassword },
    create: {
      name: "Store Admin",
      email: "admin@labelsaumya.com",
      role: "ADMIN",
      passwordHash: adminPassword
    }
  });

  await prisma.category.createMany({ data: categories });
  const categoryRows = await prisma.category.findMany();

  const productsToCreate: Prisma.ProductUncheckedCreateInput[] = [];
  const targetCount = 300;

  for (let i = 0; i < targetCount; i += 1) {
    const category = pick(categoryRows, i);
    const color = pick(colors, i);
    const fabric = pick(fabrics, i + 2);
    const work = pick(workTypes, i + 4);
    const weave = pick(weaves, i + 6);
    const occ1 = pick(occasions, i + 3);
    const occ2 = pick(occasions, i + 7);
    const adjective = pick(adjectives, i);
    const descriptor = pick(descriptors, i + 1);

    const title = `${adjective} ${color} ${descriptor} ${category.name.replace("Sarees", "Saree")}`;
    const basePrice = priceBand(category.slug, i);
    const discountPct = [10, 12, 15, 18, 20, 25, 30][i % 7];
    const compareAtPrice = Math.round(basePrice * (1 + discountPct / 100));
    const rating = Number((4 + ((i % 10) / 20)).toFixed(1));
    const reviewCount = 12 + (i % 320);
    const isNewArrival = i % 5 === 0;
    const bestseller = i % 6 === 0;
    const featured = i % 9 === 0;
    const readyToShip = i % 4 === 0;

    const badges = [
      ...(isNewArrival ? ["New"] : []),
      ...(bestseller ? ["Bestseller"] : []),
      ...(category.slug.includes("festive") || category.slug.includes("bridal") ? ["Festive"] : []),
      ...(i % 13 === 0 ? ["Limited Stock"] : []),
      `${discountPct}% OFF`
    ];

    const shortDescription = `Premium ${fabric.toLowerCase()} saree with ${work.toLowerCase()} and graceful ${weave.toLowerCase()} finish.`;
    const description = `${title} is crafted for refined Indian wardrobes with luxurious drape quality and occasion-ready elegance. Designed with ${work.toLowerCase()}, this saree blends artisan detail and wearable sophistication for wedding rituals, festive gatherings, and statement evenings.`;

    const categoryImages = getCategoryImages(category.slug);
    const imgs = [
      categoryImages[i % categoryImages.length],
      categoryImages[(i + 1) % categoryImages.length],
      categoryImages[(i + 2) % categoryImages.length],
      ...(i % 3 === 0 ? [categoryImages[(i + 1) % categoryImages.length]] : []),
      ...(i % 5 === 0 ? [categoryImages[(i + 2) % categoryImages.length]] : [])
    ];

    productsToCreate.push({
      title,
      slug: `${slugify(title)}-${i + 1}`,
      shortDescription,
      description,
      fabricDetails: `${fabric} with ${work.toLowerCase()}`,
      fabric,
      colorFamily: color,
      workType: work,
      weave,
      sareeLength: "5.5 meters",
      blousePieceIncluded: true,
      washCare: "Dry clean only. Store in muslin for long-term shine retention.",
      care: "Dry clean only",
      price: new Prisma.Decimal(basePrice),
      compareAtPrice: new Prisma.Decimal(compareAtPrice),
      stock: i % 13 === 0 ? 4 : 12 + (i % 20),
      sku: `SAREE-${(i + 1).toString().padStart(4, "0")}`,
      colors: [color, pick(colors, i + 3)],
      sizes: ["Free Size"],
      occasions: [occ1, occ2],
      featured,
      bestseller,
      isNewArrival,
      readyToShip,
      availability: i % 13 === 0 ? "LIMITED_STOCK" : "IN_STOCK",
      rating,
      reviewCount,
      badges,
      images: imgs,
      categoryId: category.id
    });
  }

  for (const chunkStart of Array.from({ length: Math.ceil(productsToCreate.length / 30) }, (_, idx) => idx * 30)) {
    await prisma.product.createMany({ data: productsToCreate.slice(chunkStart, chunkStart + 30) });
  }

  await prisma.coupon.createMany({
    data: [
      {
        code: "ROYAL10",
        discountType: "PERCENT",
        discountValue: new Prisma.Decimal(10),
        minOrderValue: new Prisma.Decimal(1999),
        maxDiscount: new Prisma.Decimal(2000),
        usageLimit: 3000,
        isActive: true
      },
      {
        code: "BRIDE1500",
        discountType: "FLAT",
        discountValue: new Prisma.Decimal(1500),
        minOrderValue: new Prisma.Decimal(15000),
        usageLimit: 1000,
        isActive: true
      }
    ]
  });

  const seededProducts = await prisma.product.findMany({ take: 120, orderBy: { createdAt: "desc" } });
  await prisma.review.createMany({
    data: seededProducts.slice(0, 100).map((product, idx) => ({
      productId: product.id,
      userId: admin.id,
      rating: 4 + (idx % 2),
      comment: idx % 2 === 0 ? "Excellent saree finish with graceful drape." : "Premium texture and beautiful festive look."
    }))
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete with 300 saree products");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
