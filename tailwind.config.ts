import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

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
        primary: {
          DEFAULT: "#0F4C81",
          50: "#E8F1FB",
          100: "#C5D9F4",
          200: "#9DBDE8",
          300: "#74A1DC",
          400: "#4B85D0",
          500: "#1E88E5",
          600: "#1565C0",
          700: "#0F4C81",
          800: "#0A3459",
          900: "#051C31",
        },
        secondary: "#1E88E5",
        success: {
          DEFAULT: "#2E7D32",
          light: "#E8F5E9",
        },
        warning: {
          DEFAULT: "#F9A825",
          light: "#FFF8E1",
        },
        danger: {
          DEFAULT: "#D32F2F",
          light: "#FFEBEE",
        },
        india: {
          saffron: "#FF9933",
          white: "#FFFFFF",
          green: "#138808",
          navy: "#000080",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans", "system-ui", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        accessible: ["1.125rem", { lineHeight: "1.75rem" }],
        "accessible-lg": ["1.25rem", { lineHeight: "2rem" }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(135deg, #0F4C81 0%, #1E88E5 50%, #0D47A1 100%)",
        "india-stripe":
          "linear-gradient(180deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(30, 136, 229, 0.3)",
      },
    },
  },
  plugins: [typography],
};

export default config;
