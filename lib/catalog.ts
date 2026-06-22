import { Prisma } from "@prisma/client";
import { getCategoryImageByIndex } from "@/lib/product-images";

export type SareeCategory = {
  name: string;
  slug: string;
  description: string;
  hero: string;
  image: string;
  heroImage: string;
};

export type CollectionLink = {
  name: string;
  slug: string;
  description: string;
  hero: string;
};

function category(name: string, slug: string, description: string, hero: string): SareeCategory {
  return {
    name,
    slug,
    description,
    hero,
    image: getCategoryImageByIndex(slug, 0),
    heroImage: getCategoryImageByIndex(slug, 1)
  };
}

export const sareeCategories: SareeCategory[] = [
  category("New Arrivals", "new-arrivals", "Latest saree drops curated every week.", "Fresh festive and wedding-ready drapes."),
  category("Bestsellers", "bestsellers", "Most loved sarees across occasions.", "Signature styles customers reorder every season."),
  category("Kanjivaram Sarees", "kanjivaram-sarees", "Rich silk drapes with heritage zari detailing.", "Temple borders, bridal tones, heirloom craftsmanship."),
  category("Banarasi Sarees", "banarasi-sarees", "Classic Banarasi weave with regal motifs.", "Timeless brocade textures for celebrations."),
  category("Linen Sarees", "linen-sarees", "Lightweight breathable sarees for elegant daywear.", "Effortless drapes for modern everyday elegance."),
  category("Cotton Sarees", "cotton-sarees", "Soft cotton sarees for comfort and grace.", "Handfeel-forward classics for office and casual wear."),
  category("Tussar Sarees", "tussar-sarees", "Natural-texture tussar styles with artisanal charm.", "Subtle sheen and sophisticated festive presence."),
  category("Silk Sarees", "silk-sarees", "Premium silk sarees from festive to bridal edits.", "Lustrous drapes designed for grand occasions."),
  category("Organza Sarees", "organza-sarees", "Feather-light organza with statement styling.", "Sheer structure and contemporary royal appeal."),
  category("Chiffon Sarees", "chiffon-sarees", "Flowy chiffon sarees with graceful movement.", "Light drapes crafted for evening sophistication."),
  category("Georgette Sarees", "georgette-sarees", "Soft georgette sarees with flattering fall.", "Party-ready silhouettes with effortless drape."),
  category("Handloom Sarees", "handloom-sarees", "Handwoven sarees celebrating Indian craft clusters.", "Authentic loom stories in wearable luxury."),
  category("Printed Sarees", "printed-sarees", "Artful prints in elevated saree silhouettes.", "Statement motifs for contemporary wardrobes."),
  category("Embroidered Sarees", "embroidered-sarees", "Intricate embroidery sarees for occasions.", "Fine-thread work and rich surface detailing."),
  category("Bridal Sarees", "bridal-sarees", "Curated bridal sarees in deep jewel tones.", "Wedding ceremony drapes with premium finish."),
  category("Festive Sarees", "festive-sarees", "Festive edits with zari and celebratory accents.", "Perfect drapes for pujas, family gatherings, and celebrations."),
  category("Party Wear Sarees", "party-wear-sarees", "Modern party sarees with statement glam.", "Cocktail-ready drapes with polished styling."),
  category("Daily Wear Sarees", "daily-wear-sarees", "Daily essentials balancing comfort and style.", "Refined sarees for repeat wardrobe mileage.")
];

export const collectionMenuLinks: CollectionLink[] = [
  {
    name: "All Products",
    slug: "all",
    description: "Browse the full Label Saumya saree catalogue.",
    hero: "A complete edit of sarees across fabric, drape, and occasion."
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Latest saree drops curated every week.",
    hero: "Fresh festive and wedding-ready drapes."
  },
  {
    name: "Best Sellers",
    slug: "bestsellers",
    description: "Most loved sarees across occasions.",
    hero: "Signature styles customers reorder every season."
  }
];

export const fabricMenuLinks: CollectionLink[] = [
  {
    name: "Viscose Crepe",
    slug: "viscose-crepe",
    description: "Fluid crepe sarees with soft movement and polished fall.",
    hero: "Day-to-evening drapes with an easy, graceful finish."
  },
  {
    name: "Viscose Silk",
    slug: "viscose-silk",
    description: "Silk-inspired sarees with gentle sheen and rich drape.",
    hero: "Elevated satin-like flow for celebrations and gifting."
  },
  {
    name: "Viscose Organza",
    slug: "viscose-organza",
    description: "Lightweight sheer sarees with structured elegance.",
    hero: "Statement organza drapes with occasion-ready styling."
  },
  {
    name: "Viscose Georgette",
    slug: "viscose-georgette",
    description: "Soft georgette textures tailored for party dressing.",
    hero: "Flattering drapes with smooth, wearable movement."
  },
  {
    name: "Viscose Chinon",
    slug: "viscose-chinon",
    description: "Flowy chinon-style sarees with a polished finish.",
    hero: "Light celebratory drapes with a refined festive silhouette."
  },
  {
    name: "Viscose Chiffon",
    slug: "viscose-chiffon",
    description: "Airy chiffon sarees for effortless elegance.",
    hero: "Feather-light drapes for soirées, dinners, and gifting."
  },
  {
    name: "Viscose Tissue Silk",
    slug: "viscose-tissue-silk",
    description: "Shimmer-led tissue silk sarees with rich festive appeal.",
    hero: "Luminous textures styled for occasion wardrobes."
  },
  {
    name: "Viscose Lenin",
    slug: "viscose-lenin",
    description: "Linen-feel sarees balancing texture and breathable comfort.",
    hero: "Everyday sophistication with crisp, modern drape."
  },
  {
    name: "Tusser Silk",
    slug: "tusser-silk",
    description: "Textural silk sarees with artisanal warmth and understated sheen.",
    hero: "Craft-forward drapes with timeless festive elegance."
  }
];

export const occasionMenuLinks: CollectionLink[] = [
  {
    name: "Festival Sarees",
    slug: "festival-sarees",
    description: "Occasion-ready sarees curated for festive gatherings and family celebrations.",
    hero: "Zari, colour, and celebratory drape in one polished edit."
  },
  {
    name: "Party Wear Sarees",
    slug: "party-wear-sarees",
    description: "Statement sarees for cocktails, dinners, and evening events.",
    hero: "Polished glamour with graceful movement."
  },
  {
    name: "Kitty Party Sarees",
    slug: "kitty-party-sarees",
    description: "Easy-to-style sarees with social-ready shine and comfort.",
    hero: "Light festive drapes perfect for intimate celebrations."
  },
  {
    name: "Fly/Travel Saree",
    slug: "fly-travel-saree",
    description: "Lightweight sarees chosen for easy packing and repeated wear.",
    hero: "Travel-friendly drapes with comfort-first elegance."
  },
  {
    name: "Temple Wear",
    slug: "temple-wear",
    description: "Classic sarees suited to poojas, ceremonies, and heritage dressing.",
    hero: "Traditional borders, rich colour, and graceful ritual styling."
  },
  {
    name: "Corporate Saree",
    slug: "corporate-saree",
    description: "Refined sarees built for office, meetings, and everyday polish.",
    hero: "Professional drapes with soft structure and all-day comfort."
  }
];

const virtualCollections = [...collectionMenuLinks, ...fabricMenuLinks, ...occasionMenuLinks];

export const fabricOptions = ["Pure Silk", "Soft Silk", "Kanjivaram Silk", "Banarasi Silk", "Linen", "Cotton", "Tussar", "Organza", "Chiffon", "Georgette", "Handloom"];
export const colorFamilies = ["Maroon", "Wine", "Ivory", "Gold", "Emerald", "Indigo", "Rose", "Beige", "Black", "Navy", "Pink", "Mustard"];
export const occasionOptions = ["Wedding", "Festive", "Party", "Office", "Casual", "Daily Wear"];
export const workTypes = ["Zari Work", "Temple Border", "Embroidered", "Printed", "Woven Motifs", "Handloom", "Minimal"];
export const weaveOptions = ["Kanjivaram", "Banarasi", "Jamdani", "Tussar Weave", "Chanderi", "Plain Weave", "Jacquard"];

export function isVirtualCategory(slug: string) {
  return virtualCollections.some((item) => item.slug === slug);
}

export function getCollectionContent(slug: string) {
  const categoryMatch = sareeCategories.find((item) => item.slug === slug);
  if (categoryMatch) return categoryMatch;

  const virtualMatch = virtualCollections.find((item) => item.slug === slug);
  if (!virtualMatch) return null;

  return {
    ...virtualMatch,
    image: getCategoryImageByIndex(slug, 0),
    heroImage: getCategoryImageByIndex(slug, 1)
  };
}

function containsAny(field: string, values: string[]): Prisma.ProductWhereInput[] {
  return values.map((value) => ({
    [field]: { contains: value, mode: "insensitive" }
  })) as Prisma.ProductWhereInput[];
}

export function getVirtualCollectionWhere(slug: string): Prisma.ProductWhereInput | null {
  switch (slug) {
    case "all":
    case "new-arrivals":
    case "bestsellers":
      return null;
    case "viscose-crepe":
      return { OR: containsAny("fabric", ["Georgette", "Chiffon"]) };
    case "viscose-silk":
      return { OR: containsAny("fabric", ["Soft Silk", "Pure Silk", "Banarasi Silk", "Kanjivaram Silk"]) };
    case "viscose-organza":
      return { OR: containsAny("fabric", ["Organza"]) };
    case "viscose-georgette":
      return { OR: containsAny("fabric", ["Georgette"]) };
    case "viscose-chinon":
      return { OR: containsAny("fabric", ["Georgette", "Chiffon"]) };
    case "viscose-chiffon":
      return { OR: containsAny("fabric", ["Chiffon"]) };
    case "viscose-tissue-silk":
      return { OR: containsAny("fabric", ["Soft Silk", "Pure Silk", "Organza"]) };
    case "viscose-lenin":
      return { OR: containsAny("fabric", ["Linen"]) };
    case "tusser-silk":
      return { OR: containsAny("fabric", ["Tussar"]) };
    case "festival-sarees":
      return {
        OR: [
          { category: { slug: "festive-sarees" } },
          { occasions: { has: "Festive" } }
        ]
      };
    case "party-wear-sarees":
      return {
        OR: [
          { category: { slug: "party-wear-sarees" } },
          { occasions: { has: "Party" } }
        ]
      };
    case "kitty-party-sarees":
      return {
        OR: [
          { category: { slug: "party-wear-sarees" } },
          { occasions: { has: "Party" } },
          { fabric: { contains: "Georgette", mode: "insensitive" } },
          { fabric: { contains: "Chiffon", mode: "insensitive" } }
        ]
      };
    case "fly-travel-saree":
      return {
        OR: [
          { readyToShip: true },
          { fabric: { contains: "Linen", mode: "insensitive" } },
          { fabric: { contains: "Cotton", mode: "insensitive" } },
          { fabric: { contains: "Chiffon", mode: "insensitive" } },
          { fabric: { contains: "Georgette", mode: "insensitive" } }
        ]
      };
    case "temple-wear":
      return {
        OR: [
          { workType: { contains: "Temple Border", mode: "insensitive" } },
          { category: { slug: "kanjivaram-sarees" } },
          { category: { slug: "festive-sarees" } }
        ]
      };
    case "corporate-saree":
      return {
        OR: [
          { occasions: { has: "Office" } },
          { category: { slug: "daily-wear-sarees" } },
          { category: { slug: "linen-sarees" } },
          { category: { slug: "cotton-sarees" } }
        ]
      };
    default:
      return null;
  }
}

export function toLabel(value: string) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
