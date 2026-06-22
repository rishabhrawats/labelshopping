import Link from "next/link";
import { cn } from "@/lib/utils";

export function FilterChip({ label, href, active }: { label: string; href: string; active?: boolean }) {
  return (
    <Link href={href} className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em]", active ? "border-maroon bg-maroon text-white" : "border-border bg-white text-ink hover:border-maroon hover:text-maroon")}>
      {label}
    </Link>
  );
}

