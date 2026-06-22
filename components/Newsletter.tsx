import { Button } from "@/components/ui/Button";

export function Newsletter() {
  return (
    <section className="rounded-3xl bg-maroon p-8 text-[#fff8ee] md:p-12">
      <h2 className="font-display text-h2">Join Our Royal Circle</h2>
      <p className="mt-2 max-w-2xl text-small text-[#f4e7cc]">Get early access to limited saree drops, bridal previews, and private festive offers.</p>
      <form className="mt-6 flex flex-col gap-3 md:flex-row">
        <input type="email" placeholder="Enter your email" className="w-full rounded-xl border border-[#f0dcb4]/60 bg-transparent px-4 py-3 text-sm placeholder:text-[#f4e7cc]" required />
        <Button className="bg-gold text-ink hover:bg-[#d8b85a]">Subscribe</Button>
      </form>
    </section>
  );
}

