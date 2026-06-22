const badges = [
  "Free Shipping Above INR 2999",
  "100% Authentic Saree Weaves",
  "Secure Checkout + COD",
  "Easy Returns Within 3 Days"
];

export function TrustBadges() {
  return (
    <section className="grid gap-3 md:grid-cols-4">
      {badges.map((badge) => (
        <div key={badge} className="rounded-xl border border-border bg-white px-4 py-3 text-center text-small font-medium text-maroon">
          {badge}
        </div>
      ))}
    </section>
  );
}

