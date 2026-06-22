import { withBasePath } from "@/lib/site";

const base = withBasePath("/sarees");

export const uploadedSareeImages = Array.from({ length: 26 }, (_, index) => `${base}/saree-upload-${String(index + 1).padStart(2, "0")}.jpg`);

const categorySlugs = [
  "new-arrivals",
  "bestsellers",
  "kanjivaram-sarees",
  "banarasi-sarees",
  "linen-sarees",
  "cotton-sarees",
  "tussar-sarees",
  "silk-sarees",
  "organza-sarees",
  "chiffon-sarees",
  "georgette-sarees",
  "handloom-sarees",
  "printed-sarees",
  "embroidered-sarees",
  "bridal-sarees",
  "festive-sarees",
  "party-wear-sarees",
  "daily-wear-sarees"
];

export const categoryImageLibrary: Record<string, string[]> = Object.fromEntries(
  categorySlugs.map((slug, idx) => {
    const start = (idx * 2) % uploadedSareeImages.length;
    const images = [
      uploadedSareeImages[start],
      uploadedSareeImages[(start + 1) % uploadedSareeImages.length],
      uploadedSareeImages[(start + 2) % uploadedSareeImages.length]
    ];
    return [slug, images];
  })
);

export const fallbackSareeImage = uploadedSareeImages[0];
export const heroSareeImage = uploadedSareeImages[1];

export function getCategoryImages(slug: string) {
  return categoryImageLibrary[slug] || [fallbackSareeImage];
}

export function getCategoryImageByIndex(slug: string, index: number) {
  const images = getCategoryImages(slug);
  return images[index % images.length];
}
