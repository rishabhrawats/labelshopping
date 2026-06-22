import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Pagination({ page, totalPages, prevHref, nextHref }: { page: number; totalPages: number; prevHref?: string; nextHref?: string }) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {page > 1 && prevHref ? <Link href={prevHref}><Button variant="outline">Previous</Button></Link> : null}
      <p className="px-2 text-small text-muted">Page {page} of {totalPages}</p>
      {page < totalPages && nextHref ? <Link href={nextHref}><Button>Load More</Button></Link> : null}
    </div>
  );
}

