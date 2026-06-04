import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        slatepanel: "#1E293B",
        brand: "#2563EB",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        canvas: "#F8FAFC"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
        lift: "0 20px 60px rgba(15, 23, 42, 0.14)",
        insetline: "inset 0 1px 0 rgba(255,255,255,0.55)"
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(37, 99, 235, 0.35)" },
          "70%": { boxShadow: "0 0 0 8px rgba(37, 99, 235, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37, 99, 235, 0)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.8s infinite",
        pulseRing: "pulseRing 1.8s infinite"
      }
    }
  },
  plugins: []
};

export default config;
