import fs from "fs";
import path from "path";

type Palette = {
  base: string;
  mid: string;
  accent: string;
  gold: string;
};

const categories: Array<{ slug: string; label: string; palette: Palette }> = [
  { slug: "new-arrivals", label: "New Arrivals", palette: { base: "#5A1420", mid: "#8A2A3A", accent: "#F4E9D8", gold: "#C6A76A" } },
  { slug: "bestsellers", label: "Bestsellers", palette: { base: "#4A1623", mid: "#7E2234", accent: "#F5EBDD", gold: "#D0B173" } },
  { slug: "kanjivaram-sarees", label: "Kanjivaram", palette: { base: "#641525", mid: "#9B1F34", accent: "#F8E8CB", gold: "#D4AF63" } },
  { slug: "banarasi-sarees", label: "Banarasi", palette: { base: "#3E1228", mid: "#70234B", accent: "#F3E6D2", gold: "#C9A45F" } },
  { slug: "linen-sarees", label: "Linen", palette: { base: "#8C6E4E", mid: "#B89C79", accent: "#F8F1E7", gold: "#C2A46D" } },
  { slug: "cotton-sarees", label: "Cotton", palette: { base: "#6A4E3A", mid: "#A67D5A", accent: "#F7EEE1", gold: "#C8A976" } },
  { slug: "tussar-sarees", label: "Tussar", palette: { base: "#6C563D", mid: "#A58A67", accent: "#F7EEDC", gold: "#C8A66B" } },
  { slug: "silk-sarees", label: "Silk", palette: { base: "#4A1024", mid: "#7D1A3D", accent: "#F8E6D3", gold: "#D2B06C" } },
  { slug: "organza-sarees", label: "Organza", palette: { base: "#7E5C6E", mid: "#B487A0", accent: "#F8EFF3", gold: "#C8AA76" } },
  { slug: "chiffon-sarees", label: "Chiffon", palette: { base: "#5D4B78", mid: "#8A74B0", accent: "#F4EEF9", gold: "#CBB07A" } },
  { slug: "georgette-sarees", label: "Georgette", palette: { base: "#4E395D", mid: "#7C5B90", accent: "#F2EAF8", gold: "#C5A66F" } },
  { slug: "handloom-sarees", label: "Handloom", palette: { base: "#3A4B3F", mid: "#5E7A65", accent: "#EAF2EA", gold: "#BFA66E" } },
  { slug: "printed-sarees", label: "Printed", palette: { base: "#5A2E42", mid: "#9C5274", accent: "#F7EAF0", gold: "#C9A56B" } },
  { slug: "embroidered-sarees", label: "Embroidered", palette: { base: "#532231", mid: "#8A3A56", accent: "#F6E7ED", gold: "#D0AE74" } },
  { slug: "bridal-sarees", label: "Bridal", palette: { base: "#5C0D1D", mid: "#98182F", accent: "#F9E7D4", gold: "#D5B068" } },
  { slug: "festive-sarees", label: "Festive", palette: { base: "#5C2030", mid: "#8B324A", accent: "#FAEADB", gold: "#D2AF72" } },
  { slug: "party-wear-sarees", label: "Party Wear", palette: { base: "#381B30", mid: "#6D3760", accent: "#F5EAF4", gold: "#C8AA73" } },
  { slug: "daily-wear-sarees", label: "Daily Wear", palette: { base: "#57524A", mid: "#837A6B", accent: "#F4F0E8", gold: "#BFA97D" } }
];

const outDir = path.join(process.cwd(), "public", "images", "sarees");
fs.mkdirSync(outDir, { recursive: true });

function imageSvg(label: string, variant: number, palette: Palette) {
  const waveA = 180 + variant * 40;
  const waveB = 420 + variant * 38;
  const waveC = 700 + variant * 36;
  const opacity = (0.16 + variant * 0.05).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.base}"/>
      <stop offset="55%" stop-color="${palette.mid}"/>
      <stop offset="100%" stop-color="${palette.accent}"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="15%" r="50%">
      <stop offset="0%" stop-color="#ffffff66"/>
      <stop offset="100%" stop-color="#ffffff00"/>
    </radialGradient>
    <linearGradient id="fabric" x1="0" y1="0" x2="0.9" y2="1">
      <stop offset="0%" stop-color="#ffffff22"/>
      <stop offset="100%" stop-color="#0000001a"/>
    </linearGradient>
    <pattern id="motif" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="2.4" fill="${palette.gold}" opacity="0.65"/>
    </pattern>
  </defs>
  <rect width="1200" height="1600" fill="url(#bg)"/>
  <rect width="1200" height="1600" fill="url(#glow)"/>
  <path d="M0 ${waveA} C 250 ${waveA - 120}, 540 ${waveA + 120}, 1200 ${waveA - 40} L1200 1600 L0 1600 Z" fill="#ffffff1f"/>
  <path d="M0 ${waveB} C 320 ${waveB - 120}, 760 ${waveB + 140}, 1200 ${waveB - 30} L1200 1600 L0 1600 Z" fill="#00000018"/>
  <path d="M0 ${waveC} C 420 ${waveC - 100}, 760 ${waveC + 100}, 1200 ${waveC - 30} L1200 1600 L0 1600 Z" fill="#ffffff14"/>

  <g transform="translate(630,260)">
    <ellipse cx="0" cy="70" rx="95" ry="115" fill="#f2d0b6"/>
    <ellipse cx="0" cy="290" rx="145" ry="170" fill="#f0d2bc"/>
    <path d="M-190 230 C -60 120, 90 120, 220 250 C 170 430, 115 560, 70 840 C -20 870, -110 810, -175 640 C -220 510, -250 360, -190 230 Z" fill="${palette.mid}"/>
    <path d="M-178 260 C -60 190, 110 240, 220 370 C 195 500, 140 670, 98 860 C 30 890, -58 840, -122 700 C -180 575, -208 430, -178 260 Z" fill="url(#fabric)"/>
    <path d="M175 340 C 120 280, 48 270, -18 320 C -88 370, -122 460, -108 560 C -25 540, 58 552, 150 620 C 206 663, 236 730, 250 812 C 310 760, 346 690, 352 615 C 360 505, 294 408, 175 340 Z" fill="${palette.base}"/>
    <path d="M160 355 C 85 305, 8 325, -56 386 C -102 430, -126 490, -122 545 C -70 532, 6 540, 88 592 C 178 647, 248 727, 280 824 C 322 778, 344 713, 340 642 C 334 530, 265 430, 160 355 Z" fill="url(#motif)" opacity="${opacity}"/>
    <rect x="-220" y="824" width="570" height="18" rx="9" fill="${palette.gold}" opacity="0.78"/>
  </g>

  <g>
    <rect x="56" y="64" width="1088" height="1472" rx="24" ry="24" fill="none" stroke="${palette.gold}" stroke-width="3" opacity="0.64"/>
    <rect x="72" y="80" width="1056" height="1440" rx="18" ry="18" fill="none" stroke="#ffffff33" stroke-width="2"/>
  </g>

  <text x="96" y="1458" font-family="Playfair Display, Georgia, serif" font-size="52" fill="#fff8ef" opacity="0.96">${label}</text>
  <text x="96" y="1510" font-family="Inter, Arial, sans-serif" font-size="20" fill="#fff2df" opacity="0.84">Label Saumya • Editorial Saree Series</text>
</svg>`;
}

for (const category of categories) {
  for (let variant = 1; variant <= 3; variant += 1) {
    const filename = `${category.slug}-${variant}.svg`;
    fs.writeFileSync(path.join(outDir, filename), imageSvg(category.label, variant, category.palette), "utf8");
  }
}

// Shared hero and fallback assets
fs.writeFileSync(
  path.join(outDir, "hero-saree.svg"),
  imageSvg("Signature Saree Edit", 2, { base: "#5A1420", mid: "#8E2A40", accent: "#F7E8D4", gold: "#D2B06D" }),
  "utf8"
);
fs.writeFileSync(
  path.join(outDir, "fallback-saree.svg"),
  imageSvg("Curated Saree", 1, { base: "#634A57", mid: "#8D6D80", accent: "#F4ECF1", gold: "#C7A86D" }),
  "utf8"
);

console.log("Generated premium demo saree image set.");
