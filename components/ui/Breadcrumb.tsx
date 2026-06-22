import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
          {item.href ? <Link href={item.href} className="hover:text-maroon">{item.label}</Link> : <span className="text-ink">{item.label}</span>}
          {index !== items.length - 1 ? <ChevronRight size={14} /> : null}
        </span>
      ))}
    </nav>
  );
}

