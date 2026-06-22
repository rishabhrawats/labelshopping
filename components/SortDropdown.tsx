"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortDropdownProps = {
  value: string;
};

export function SortDropdown({ value }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (nextSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", nextSort);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      name="sort"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-xl border border-border bg-white p-2.5 text-sm"
      aria-label="Sort products"
    >
      <option value="popular">Popular</option>
      <option value="low-high">Price Low-High</option>
      <option value="high-low">Price High-Low</option>
      <option value="newest">Newest</option>
    </select>
  );
}
