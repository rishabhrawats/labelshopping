"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { colorFamilies, fabricOptions, occasionOptions, weaveOptions, workTypes } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";

function FilterPanel({ mobileClose }: { mobileClose?: () => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    mobileClose?.();
  };

  const select = (label: string, key: string, options: string[]) => (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
      <select
        defaultValue={searchParams.get(key) ?? ""}
        onChange={(e) => setParam(key, e.target.value)}
        className="w-full rounded-xl border border-border bg-white p-2.5 text-sm"
      >
        <option value="">All</option>
        {options.map((value) => (
          <option key={value} value={value.toLowerCase()}>{value}</option>
        ))}
      </select>
    </div>
  );

  return (
    <aside className="space-y-4 rounded-2xl border border-border bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-h4 text-maroon">Filters</h3>
        {mobileClose ? <button onClick={mobileClose} className="rounded-lg border border-border p-2 md:hidden"><X size={16} /></button> : null}
      </div>
      {select("Price", "price", ["0-1999", "2000-4999", "5000-9999", "10000-99999"])}
      {select("Fabric", "fabric", fabricOptions)}
      {select("Color Family", "color", colorFamilies)}
      {select("Occasion", "occasion", occasionOptions)}
      {select("Work Type", "work", workTypes)}
      {select("Weave", "weave", weaveOptions)}
      {select("Discount", "discount", ["10", "20", "30", "40"])}
      {select("Availability", "availability", ["In Stock", "Limited Stock"])}
      {select("Ready To Ship", "ready", ["Yes"])}
      <Button variant="secondary" className="w-full" onClick={clearFilters}>Clear Filters</Button>
    </aside>
  );
}

export function Filters() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-3 md:hidden">
        <Button variant="outline" iconLeft={<SlidersHorizontal size={16} />} onClick={() => setOpen(true)}>Open Filters</Button>
      </div>

      <div className="hidden md:block">
        <FilterPanel />
      </div>

      {open ? (
        <div className="fixed inset-0 z-[65] bg-black/40 p-4 md:hidden" onClick={() => setOpen(false)}>
          <div className="max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <FilterPanel mobileClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}

