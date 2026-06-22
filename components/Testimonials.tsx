"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Shreya V", text: "The Kanjivaram drape quality is exceptional. It looked regal for my wedding ritual." },
  { name: "Pooja R", text: "Beautiful packaging and true-to-image saree tones. The fabric fall is premium." },
  { name: "Ananya K", text: "My go-to for festive sarees now. Elegant styles and reliable quality every time." }
];

export function Testimonials() {
  return (
    <section className="space-y-6">
      <h2 className="font-display text-h2 text-maroon">Stories from Our Saree Community</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12 }}
            className="rounded-2xl border border-border bg-white p-6 shadow-card"
          >
            <p className="text-body text-muted">&ldquo;{item.text}&rdquo;</p>
            <p className="mt-4 font-semibold text-maroon">{item.name}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

