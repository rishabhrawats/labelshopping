"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <form
      className="relative hidden w-full max-w-md md:block"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const q = String(fd.get("q") || "").trim();
        const params = new URLSearchParams(searchParams.toString());
        if (q) params.set("q", q);
        else params.delete("q");
        router.push(`/collection/all?${params.toString()}`);
      }}
    >
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input name="q" defaultValue={pathname.includes("collection") ? (searchParams.get("q") || "") : ""} placeholder="Search Label Saumya sarees..." className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted" />
    </form>
  );
}

