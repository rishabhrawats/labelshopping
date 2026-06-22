export const revalidate = 120;

import { HeroSection } from "@/components/HeroSection";
import { OfferStrip } from "@/components/OfferStrip";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { TrustBadges } from "@/components/TrustBadges";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getAllProducts } from "@/lib/storefront";

export default async function HomePage() {
  const products = await getAllProducts(12);

  return (
    <div className="pb-16 pt-6">
      <section className="container-page"><HeroSection /></section>
      <section className="container-page mt-6"><OfferStrip /></section>
      <section className="container-page mt-4"><TrustBadges /></section>

      <section className="container-page section-space">
        <SectionHeader title="The Collection" description="Eleven distinct sarees, presented with complete product photography." />
        <ProductGrid products={products} />
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
