import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBase: "#0c0c0c",
        lightBase: "#fbfbfb",
        obsidian: {
          base: "#0c0c0c",
          card: "#141414",
          border: "rgba(255, 255, 255, 0.05)",
          borderLight: "rgba(0, 0, 0, 0.06)",
        },
        luxury: {
          gold: "#c5a880",
          goldHover: "#d8b990",
          cream: "#faf6f0",
        },
        accent: {
          DEFAULT: "#c5a880", // quiet luxury default gold
          secondary: "#14B8A6", // teal-500
        },
        warning: "#F59E0B", // amber-500
        danger: "#EF4444", // red-500
        glass: {
          dark: "rgba(20, 20, 20, 0.6)",
          light: "rgba(255, 255, 255, 0.75)",
          borderDark: "rgba(255, 255, 255, 0.05)",
          borderLight: "rgba(0, 0, 0, 0.06)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        widest: "0.15em",
      },
      backdropBlur: {
        "2xl": "40px",
      },
      borderRadius: {
        "3xl": "24px",
      },
      boxShadow: {
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.25)",
        "glass-light": "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
        "accent-glow": "0 0 15px rgba(139, 92, 246, 0.25)",
        "success-glow": "0 0 15px rgba(20, 184, 166, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
