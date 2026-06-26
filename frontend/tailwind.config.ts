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
        darkBase: "#050A0F",
        lightBase: "#050A0F",
        obsidian: {
          base: "#050A0F",
          card: "#0C1A26",
          border: "rgba(0, 212, 255, 0.15)",
          borderLight: "rgba(0, 212, 255, 0.15)",
        },
        luxury: {
          gold: "#C9A84C",
          goldHover: "#E2C366",
          cream: "#0C1A26",
        },
        accent: {
          DEFAULT: "#00D4FF", // electric cyan-teal
          secondary: "#C9A84C", // muted gold / champagne
        },
        warning: "#FFB020", // amber-500 equivalent
        danger: "#FF4C6A", // soft crimson
        glass: {
          dark: "rgba(12, 26, 38, 0.7)",
          light: "rgba(12, 26, 38, 0.7)",
          borderDark: "rgba(0, 212, 255, 0.15)",
          borderLight: "rgba(0, 212, 255, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
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
        "accent-glow": "0 0 20px rgba(0, 212, 255, 0.4)",
        "success-glow": "0 0 20px rgba(0, 212, 255, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
