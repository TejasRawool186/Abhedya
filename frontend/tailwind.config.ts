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
        /* ── Claude Warm Parchment Canvas ── */
        canvas: {
          DEFAULT: "#2B2B26",    /* Dark mode main canvas */
          light: "#FAF9F5",      /* Light mode warm ivory */
        },
        surface: {
          DEFAULT: "#302F2B",    /* Sidebar / secondary panels */
          card: "rgba(7, 27, 38, 0.75)",       /* Elevated card surfaces */
          hover: "rgba(7, 27, 38, 0.85)",      /* Hovered interactive surfaces */
          input: "#2F2E2A",      /* Composer / input fields */
          raised: "rgba(7, 27, 38, 0.85)",     /* Raised panels */
          light: "#F0EFEA",      /* Light mode sidebar */
        },
        border: {
          subtle: "#3E3D38",     /* Primary dividers, subtle borders */
          medium: "#4A4944",     /* Active borders, panels */
          focus: "#D97757",      /* Focused input ring - terracotta */
          light: "#E5E4DF",      /* Light mode borders */
        },
        primary: {
          DEFAULT: "#ECEBE6",    /* Primary text (warm white) */
          secondary: "#A8A69E",  /* Secondary / muted text */
          muted: "#706E6B",      /* Placeholders, disabled, faint */
        },
        accent: {
          DEFAULT: "#D97757",    /* Claude terracotta brand */
          hover: "#E08868",      /* Terracotta hover */
          pressed: "#C4654A",    /* Terracotta pressed */
          glow: "rgba(217, 119, 87, 0.12)", /* Subtle warm glow */
        },
        status: {
          success: "#4DA37A",    /* Warm sage green */
          warning: "#D4A843",    /* Warm amber */
          danger: "#C9554D",     /* Warm coral red */
          info: "#5B8ABF",       /* Muted blue */
        },
      },
      fontFamily: {
        serif: [
          "Georgia",
          '"Times New Roman"',
          "serif",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        "body": ["0.9375rem", { lineHeight: "1.6" }],   /* 15px */
        "sm-body": ["0.8125rem", { lineHeight: "1.5" }], /* 13px */
        "caption": ["0.6875rem", { lineHeight: "1.4" }], /* 11px */
      },
      boxShadow: {
        glow: "0 0 20px rgba(217, 119, 87, 0.12)",
        floating: "0 4px 24px -4px rgba(0, 0, 0, 0.25)",
        card: "0 2px 12px -2px rgba(0, 0, 0, 0.15)",
        composer: "0 -4px 30px -10px rgba(0, 0, 0, 0.3)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
