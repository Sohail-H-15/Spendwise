/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        card: "rgba(30,41,59,0.7)",
        cyan: { DEFAULT: "#06B6D4", dark: "#0891B2" },
        income: "#22C55E",
        expense: "#EF4444",
        surface: "#1E293B",
      },
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(6,182,212,0.25)",
        "glow-green": "0 0 30px rgba(34,197,94,0.25)",
        "glow-red": "0 0 30px rgba(239,68,68,0.25)",
        glass: "0 8px 32px rgba(0,0,0,0.37)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)",
        "hero-gradient": "radial-gradient(ellipse at top, #0F2942 0%, #0F172A 60%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        pulse_slow: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
