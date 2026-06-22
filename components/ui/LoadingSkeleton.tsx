export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-card">
      <div className="h-72 animate-pulse rounded-xl bg-surface" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-surface" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-surface" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
      </div>
    </div>
  );
}
