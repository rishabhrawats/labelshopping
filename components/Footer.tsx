import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { withBasePath } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-[#f2e1dc]">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <span className="inline-flex items-center rounded-lg bg-gradient-to-br from-[#7f5960] via-[#9a7078] to-[#b78c91] p-2 shadow-[0_10px_22px_rgba(74,40,42,0.3)] ring-1 ring-[#c6a47a]/45">
              <Image
                src={withBasePath("/brand/logo.png")}
                alt="Label Saumya"
                width={280}
                height={112}
                className="h-16 w-auto rounded-md p-1 [filter:contrast(1.55)_brightness(1.12)_saturate(1.15)]"
              />
            </span>
            <p className="mt-3 max-w-sm text-small text-muted">Discover signature drapes crafted for celebrations, ceremonies, and everyday grace. Sarees only, always premium.</p>
            <div className="mt-5 flex gap-2">
              <Link href="/collection/new-arrivals"><Button>Shop Sarees</Button></Link>
              <Link href="/collection/bestsellers"><Button variant="outline">Bestsellers</Button></Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-h4 text-maroon">Shop</h4>
            <div className="mt-3 space-y-2 text-small text-muted">
              <Link href="/collection/kanjivaram-sarees" className="block hover:text-maroon">Kanjivaram Sarees</Link>
              <Link href="/collection/banarasi-sarees" className="block hover:text-maroon">Banarasi Sarees</Link>
              <Link href="/collection/bridal-sarees" className="block hover:text-maroon">Bridal Sarees</Link>
              <Link href="/collection/daily-wear-sarees" className="block hover:text-maroon">Daily Wear Sarees</Link>
              <Link href="/collection/all" className="block hover:text-maroon">View All Sarees</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-h4 text-maroon">Customer Care</h4>
            <div className="mt-3 space-y-2 text-small text-muted">
              <Link href="/policies/shipping" className="block hover:text-maroon">Shipping Policy</Link>
              <Link href="/policies/returns" className="block hover:text-maroon">Returns Policy</Link>
              <Link href="/policies/privacy" className="block hover:text-maroon">Privacy Policy</Link>
              <Link href="/account" className="block hover:text-maroon">Track Order</Link>
              <Link href="/auth/signin" className="block hover:text-maroon">Sign In</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-h4 text-maroon">Contact</h4>
            <p className="mt-3 text-small text-muted">+91 90000 12345</p>
            <p className="text-small text-muted">care@labelsaumya.com</p>
            <p className="mt-2 text-small text-muted">Banjara Hills, Hyderabad</p>
            <div className="mt-4">
              <Button variant="secondary">Contact Us</Button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-4 text-small text-muted">
          &copy; {new Date().getFullYear()} Label Saumya. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

