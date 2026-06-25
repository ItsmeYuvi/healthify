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
        darkBase: "#0a0a0f",
        lightBase: "#f4f4f5",
        accent: {
          DEFAULT: "#8B5CF6", // violet-500
          secondary: "#14B8A6", // teal-500
        },
        warning: "#F59E0B", // amber-500
        danger: "#EF4444", // red-500
        glass: {
          dark: "rgba(255, 255, 255, 0.10)",
          light: "rgba(255, 255, 255, 0.65)",
          borderDark: "rgba(255, 255, 255, 0.15)",
          borderLight: "rgba(0, 0, 0, 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
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
