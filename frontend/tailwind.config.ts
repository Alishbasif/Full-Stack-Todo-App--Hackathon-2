import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        surface: "#18181B",
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#F8FAFC",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          foreground: "#F8FAFC",
        },
        accent: {
          cyan: "#22D3EE",
          emerald: "#10B981",
        },
        border: "rgba(255,255,255,0.08)",
        muted: "#A1A1AA",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "22px",
      },
      boxShadow: {
        "glow-primary": "0 0 24px 0 rgba(59, 130, 246, 0.45)",
        "glow-secondary": "0 0 24px 0 rgba(139, 92, 246, 0.45)",
        "glow-cyan": "0 0 24px 0 rgba(34, 211, 238, 0.4)",
        "glow-emerald": "0 0 24px 0 rgba(16, 185, 129, 0.4)",
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), transparent 60%)",
        "aurora-2":
          "radial-gradient(circle at 80% 30%, rgba(139,92,246,0.35), transparent 60%)",
        "aurora-3":
          "radial-gradient(circle at 50% 80%, rgba(34,211,238,0.25), transparent 60%)",
      },
      keyframes: {
        "aurora-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(3%, -4%) scale(1.05)" },
          "66%": { transform: "translate(-3%, 3%) scale(0.97)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "aurora-float": "aurora-float 18s ease-in-out infinite",
        "aurora-float-slow": "aurora-float 26s ease-in-out infinite reverse",
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
