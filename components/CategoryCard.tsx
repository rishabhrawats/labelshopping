import Link from "next/link";
import Image from "next/image";
import { SareeCategory } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";

export function CategoryCard({ category }: { category: SareeCategory }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={category.image}
          alt={`${category.name} collection image`}
          fill
          className="object-cover transition duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-h4 text-maroon">{category.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{category.description}</p>
        <div className="mt-4">
          <Link href={`/collection/${category.slug}`}>
            <Button variant="outline" className="w-full">Explore Collection</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
