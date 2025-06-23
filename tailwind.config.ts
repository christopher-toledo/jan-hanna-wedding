import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#fefcfa",
        foreground: "#2c2c2c",
        primary: {
          DEFAULT: "#8b7355",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f8f4f0",
          foreground: "#2c2c2c",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f1ede7",
          foreground: "#6b6b6b",
        },
        accent: {
          DEFAULT: "#ebe5dd",
          foreground: "#2c2c2c",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#2c2c2c",
        },
        powderBlue: "#b6c6d8",
        peach: "#f3ad86",
        blushPink: "#f1a49a",
        slateBlue: "#67839c",
        darkGrayBlue: "#393f4a",
        linen: "#f2efeb",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)"],
        cursive: ["var(--font-pinyon-script)"],
        sans: ["var(--font-the_seasons)"],
        montserrat: ["var(--font-montserrat)"],
        spartan: ["var(--font-league-spartan)"],
        brittany: ["var(--font-brittany)"],
        alta: ["var(--font-alta)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config