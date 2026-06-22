export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-10 text-center shadow-card">
      <h3 className="font-display text-h3 text-maroon">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

