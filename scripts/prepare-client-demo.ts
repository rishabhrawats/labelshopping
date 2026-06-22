import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoProducts = Array.from({ length: 11 }, (_, index) => ({
  sku: `SAREE-${(index + 1).toString().padStart(4, "0")}`,
  title: `Demo ${index + 1}`,
  slug: `demo-${index + 1}`
}));

async function main() {
  const keepSkus = demoProducts.map((product) => product.sku);

  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany({
      where: {
        sku: { notIn: keepSkus }
      }
    });

    for (const product of demoProducts) {
      await tx.product.update({
        where: { sku: product.sku },
        data: {
          title: product.title,
          slug: product.slug,
          featured: true,
          bestseller: true,
          isNewArrival: true,
          readyToShip: true,
          badges: ["Demo"]
        }
      });
    }
  });

  console.log(`Client demo catalog prepared with ${demoProducts.length} products.`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
