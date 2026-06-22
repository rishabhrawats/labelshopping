export const revalidate = 120;

import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { OfferStrip } from "@/components/OfferStrip";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { TrustBadges } from "@/components/TrustBadges";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sareeCategories } from "@/lib/catalog";
import { getFeaturedProducts, getNewArrivals, getProductsByCategory, getTrending } from "@/lib/storefront";

export default async function HomePage() {
  const newArrivals = await getNewArrivals(8);
  const bestsellers = await getTrending(8);
  const bridalEdit = await getProductsByCategory("bridal-sarees", 8);
  const festiveEdit = await getProductsByCategory("festive-sarees", 8);
  const everydayEdit = await getProductsByCategory("daily-wear-sarees", 8);
  const featured = await getFeaturedProducts(8);

  const renderGrid = (products: any[]) => <ProductGrid products={products} />;

  return (
    <div className="pb-16 pt-6">
      <section className="container-page"><HeroSection /></section>
      <section className="container-page mt-6"><OfferStrip /></section>
      <section className="container-page mt-4"><TrustBadges /></section>

      <section className="container-page section-space">
        <SectionHeader title="Featured Saree Categories" description="Curated edits for wedding rituals, festive dressing, and everyday elegance." action={<Link href="/collection/all"><Button variant="outline">View All</Button></Link>} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {sareeCategories.slice(0, 8).map((category) => <CategoryCard key={category.slug} category={category} />)}
        </div>
      </section>

      <section className="container-page section-space">
        <SectionHeader title="New Arrivals" description="Discover signature drapes by Label Saumya." action={<Link href="/collection/new-arrivals"><Button variant="ghost">View All</Button></Link>} />
        {renderGrid(newArrivals)}
      </section>

      <section className="container-page section-space">
        <SectionHeader title="Bestsellers" description="Our most loved sarees across bridal and festive wardrobes." action={<Link href="/collection/bestsellers"><Button variant="ghost">View All</Button></Link>} />
        {renderGrid(bestsellers)}
      </section>

      <section className="container-page section-space">
        <SectionHeader title="Bridal Edit" description="Crafted for celebrations, styled for grace." action={<Link href="/collection/bridal-sarees"><Button variant="outline">Explore Bridal</Button></Link>} />
        {renderGrid(bridalEdit.length ? bridalEdit : featured)}
      </section>

      <section className="container-page section-space">
        <SectionHeader title="Festive Collection" description="Occasion drapes with zari, woven motifs, and timeless silhouettes." action={<Link href="/collection/festive-sarees"><Button variant="outline">Explore Festive</Button></Link>} />
        {renderGrid(festiveEdit.length ? festiveEdit : featured)}
      </section>

      <section className="container-page section-space">
        <SectionHeader title="Everyday Elegance" description="Lightweight sarees made for repeat wear and modern comfort." action={<Link href="/collection/daily-wear-sarees"><Button variant="ghost">Explore Daily Wear</Button></Link>} />
        {renderGrid(everydayEdit.length ? everydayEdit : featured)}
      </section>

      <section className="container-page section-space">
        <SectionHeader title="Why Label Saumya" description="Premium fabrics, refined finishing, and saree-first curation rooted in modern Indian style." />
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-white p-5"><h3 className="font-display text-h4 text-maroon">Saree-Only Focus</h3><p className="mt-2 text-small text-muted">Every design, fit note, and curation decision is saree specific.</p></article>
          <article className="rounded-2xl border border-border bg-white p-5"><h3 className="font-display text-h4 text-maroon">Premium Textile Selection</h3><p className="mt-2 text-small text-muted">From handloom cotton to bridal silk, quality and drape are non-negotiable.</p></article>
          <article className="rounded-2xl border border-border bg-white p-5"><h3 className="font-display text-h4 text-maroon">Celebration-Ready Service</h3><p className="mt-2 text-small text-muted">Fast dispatch, responsive support, and trustworthy post-purchase care.</p></article>
        </div>
      </section>

      <section className="container-page section-space"><Testimonials /></section>
      <section className="container-page"><Newsletter /></section>
    </div>
  );
}
