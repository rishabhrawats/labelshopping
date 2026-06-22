import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./actions/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F6EBE7",
        surface: "#EFDCD7",
        border: "#D9C1BA",
        maroon: "#8A5D5F",
        "deep-maroon": "#6E4548",
        gold: "#D2B372",
        ink: "#3A2928",
        muted: "#7A6662"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        luxe: "0 20px 45px rgba(64, 28, 32, 0.12)",
        card: "0 8px 24px rgba(31, 26, 23, 0.07)"
      },
      fontSize: {
        hero: ["56px", { lineHeight: "64px", fontWeight: "700" }],
        h1: ["40px", { lineHeight: "48px", fontWeight: "700" }],
        h2: ["32px", { lineHeight: "40px", fontWeight: "700" }],
        h3: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        h4: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "30px", fontWeight: "400" }],
        body: ["16px", { lineHeight: "28px", fontWeight: "400" }],
        small: ["14px", { lineHeight: "22px", fontWeight: "400" }]
      }
    }
  },
  plugins: []
};

export default config;

