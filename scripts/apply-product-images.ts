import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imageCounts = [5, 7, 5, 6, 6, 6, 5, 5, 5, 5, 6];

async function main() {
  for (let index = 0; index < imageCounts.length; index += 1) {
    const imageCount = imageCounts[index];
    const productNumber = index + 1;
    const sku = `SAREE-${productNumber.toString().padStart(4, "0")}`;
    const folder = `saree-${productNumber.toString().padStart(2, "0")}`;
    const images = Array.from(
      { length: imageCount },
      (_, imageIndex) =>
        `/products/${folder}/${(imageIndex + 1).toString().padStart(2, "0")}.webp`
    );

    await prisma.product.update({
      where: { sku },
      data: { images }
    });

    console.log(`Updated ${sku} with ${imageCount} images`);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
