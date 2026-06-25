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
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          hover: "rgba(255, 255, 255, 0.06)",
          border: "rgba(255, 255, 255, 0.08)",
          "border-hover": "rgba(255, 255, 255, 0.14)",
        },
        accent: {
          cyan: "#06b6d4",
          violet: "#8b5cf6",
        },
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      backdropBlur: {
        "3xl": "64px",
      },
      boxShadow: {
        "glass-sm": "inset 0 1px 0 0 rgba(255, 255, 255, 0.04), 0 2px 12px -2px rgba(0, 0, 0, 0.3)",
        "glass-md": "inset 0 1px 0 0 rgba(255, 255, 255, 0.04), 0 4px 24px -4px rgba(0, 0, 0, 0.3)",
        "glass-glow": "0 0 24px -4px rgba(6, 182, 212, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
