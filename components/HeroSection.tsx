"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { heroSareeImage } from "@/lib/product-images";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-deep-maroon via-maroon to-[#af7f84] text-[#fff8f2] shadow-luxe">
      <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
      <div className="grid gap-8 p-8 md:grid-cols-2 md:p-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-small uppercase tracking-[0.18em] text-[#f0ddb0]">Label Saumya</p>
          <h1 className="mt-3 font-display text-[42px] leading-[50px] md:text-hero">Curated Sarees for Timeless Elegance</h1>
          <p className="mt-4 max-w-xl text-body text-[#f9ecde]">Crafted for celebrations, styled for grace. Discover signature drapes in silk, handloom, festive, and everyday edits.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/collection/all"><Button className="bg-gold text-ink hover:bg-[#d3b44d]">Shop Sarees</Button></Link>
            <Link href="/collection/new-arrivals"><Button variant="outline" className="border-[#f3dba6] text-[#fff2d4] hover:bg-[#ffffff12]">Explore New Arrivals</Button></Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75 }} className="relative min-h-[360px] overflow-hidden rounded-2xl border border-[#f5dab4]/30">
          <Image src={heroSareeImage} alt="Premium saree hero" fill className="object-cover" priority />
        </motion.div>
      </div>
    </section>
  );
}

