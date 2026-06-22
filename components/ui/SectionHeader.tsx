import { ReactNode } from "react";

export function SectionHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-h2 text-maroon">{title}</h2>
        {description ? <p className="mt-1 text-base text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

