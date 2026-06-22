"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { collectionMenuLinks, fabricMenuLinks, occasionMenuLinks, sareeCategories } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/SearchBar";
import { withBasePath } from "@/lib/site";

const megaSections = [
  { title: "Collections", items: collectionMenuLinks },
  { title: "Fabric", items: fabricMenuLinks },
  { title: "Occasion", items: occasionMenuLinks }
];

export function Navbar() {
  const { data } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("labelsaumya:wishlist");
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    setWishlistCount(ids.length);

    fetch(withBasePath("/api/cart/count"))
      .then((res) => res.json())
      .then((payload) => setCartCount(Number(payload.count || 0)))
      .catch(() => setCartCount(0));
  }, []);

  const primaryNav = useMemo(
    () => sareeCategories.filter((c) => ["new-arrivals", "bestsellers", "festive-sarees", "silk-sarees", "cotton-sarees"].includes(c.slug)),
    []
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur">
      <div className="container-page py-2 text-center text-[11px] font-semibold tracking-[0.1em] text-maroon">
        FREE SHIPPING ABOVE INR 2999 | COD AVAILABLE | CURATED PREMIUM SAREES
      </div>

      <div className="container-page py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <button className="inline-flex rounded-lg border border-border p-2 md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>

          <Link href="/" className="inline-flex items-center">
            <span className="inline-flex items-center rounded-lg bg-gradient-to-br from-[#7f5960] via-[#9a7078] to-[#b78c91] p-1.5 shadow-[0_8px_18px_rgba(74,40,42,0.28)] ring-1 ring-[#c6a47a]/45">
              <Image
                src={withBasePath("/brand/logo.png")}
                alt="Label Saumya"
                width={260}
                height={104}
                className="h-14 w-auto rounded-md p-1 md:h-16 [filter:contrast(1.55)_brightness(1.12)_saturate(1.15)]"
                priority
              />
            </span>
          </Link>

          <div className="hidden justify-center md:flex">
            <Suspense fallback={<div className="h-10 w-full max-w-md rounded-lg border border-border bg-white" />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/collection/all" aria-label="Search" className="inline-flex rounded-lg border border-border p-2 hover:bg-surface"><Search size={16} /></Link>
            <button aria-label="Wishlist" className="relative inline-flex rounded-lg border border-border p-2 hover:bg-surface">
              <Heart size={16} />
              {wishlistCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-maroon px-1.5 text-[10px] text-white">{wishlistCount}</span> : null}
            </button>
            <Link href="/cart" aria-label="Cart" className="relative inline-flex rounded-lg border border-border p-2 hover:bg-surface">
              <ShoppingBag size={16} />
              {cartCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-maroon px-1.5 text-[10px] text-white">{cartCount}</span> : null}
            </Link>
            <Link href="/account" aria-label="Account" className="inline-flex rounded-lg border border-border p-2 hover:bg-surface"><User size={16} /></Link>
          </div>
        </div>

        <div className="mt-4 hidden items-center justify-between md:flex">
          <nav className="flex items-center gap-5 text-sm">
            <button onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)} className="relative font-medium text-ink hover:text-maroon">
              Shop Sarees
              <span className="absolute -bottom-1 left-0 h-[1px] w-full scale-x-0 bg-maroon transition group-hover:scale-x-100" />
            </button>
            {primaryNav.map((item) => (
              <Link key={item.slug} href={`/collection/${item.slug}`} className="font-medium text-ink hover:text-maroon">
                {item.name.replace(" Sarees", "")}
              </Link>
            ))}
          </nav>
          <div>
            {data?.user ? (
              <Button variant="ghost" onClick={() => signOut({ callbackUrl: withBasePath("/") })}>Sign Out</Button>
            ) : (
              <Link href="/auth/signin"><Button>Sign In / Create Account</Button></Link>
            )}
          </div>
        </div>

        {megaOpen ? (
          <div onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)} className="relative mt-3 hidden rounded-2xl border border-border bg-white p-5 shadow-card md:block">
            <div className="grid grid-cols-3 gap-6">
              {megaSections.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted">{section.title}</p>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <Link key={item.slug} href={`/collection/${item.slug}`} className="block rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-surface hover:text-maroon">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/40 p-4 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="h-full max-w-sm rounded-2xl bg-cream p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center rounded-lg bg-gradient-to-br from-[#7f5960] via-[#9a7078] to-[#b78c91] p-1 shadow-[0_8px_18px_rgba(74,40,42,0.28)] ring-1 ring-[#c6a47a]/45">
                <Image
                  src={withBasePath("/brand/logo.png")}
                  alt="Label Saumya"
                  width={180}
                  height={72}
                  className="h-10 w-auto rounded-md p-1 [filter:contrast(1.55)_brightness(1.12)_saturate(1.15)]"
                />
              </span>
              <button onClick={() => setMenuOpen(false)} className="rounded-lg border border-border p-2"><X size={16} /></button>
            </div>
            <div className="space-y-5 overflow-y-auto pb-4">
              {megaSections.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{section.title}</p>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link key={item.slug} href={`/collection/${item.slug}`} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface hover:text-maroon">
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
