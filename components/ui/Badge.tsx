import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-border bg-[#fff9ef] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-maroon", className)}>
      {children}
    </span>
  );
}

