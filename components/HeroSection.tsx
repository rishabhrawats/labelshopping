"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-deep-maroon text-[#fff8f2] shadow-luxe">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="grid min-h-[520px] lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col justify-center px-8 py-12 md:px-14 lg:py-16"
        >
          <p className="text-small uppercase tracking-[0.18em] text-[#f0ddb0]">Label Saumya</p>
          <h1 className="mt-4 max-w-xl font-display text-[42px] leading-[1.08] md:text-[58px]">Sarees, thoughtfully curated.</h1>
          <p className="mt-5 max-w-lg text-body-lg text-[#f9ecde]/90">A refined edit of graceful drapes, photographed to show every detail, texture, and finish.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/collection/all"><Button className="bg-gold px-6 text-ink hover:bg-[#d3b44d]">View Collection</Button></Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75 }}
          className="relative min-h-[440px] overflow-hidden bg-[#f7f4f2] lg:min-h-[520px]"
        >
          <Image
            src="/products/saree-02/01.webp"
            alt="Label Saumya embroidered saree"
            fill
            className="object-cover object-[center_24%]"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-maroon/15 via-transparent to-transparent lg:bg-gradient-to-r lg:from-deep-maroon/20 lg:via-transparent lg:to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

