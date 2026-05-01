/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // FIFA World Cup (2026 hosts: Mexico, USA, Canada)
        wc: {
          green: "#006847", // Mexico green
          red: "#CE1126", // Mexico / Canada red
          blue: "#002868", // USA navy
          gold: "#FFB81C", // Trophy gold
          cream: "#FFF8EC", // Field-side cream
          ink: "#0B1B2B", // Body ink
        },
      },
      fontFamily: {
        stadium: ['"Bebas Neue"', '"Oswald"', "Impact", "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        trophy: "0 10px 30px -10px rgba(0, 40, 104, 0.45)",
        card: "0 8px 24px -12px rgba(11, 27, 43, 0.35)",
      },
      backgroundImage: {
        pitch:
          "repeating-linear-gradient(90deg, #006847 0 36px, #00744f 36px 72px)",
        "wc-hero":
          "linear-gradient(135deg, #006847 0%, #002868 55%, #CE1126 100%)",
      },
      keyframes: {
        bounceBall: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        spinFast: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "bounce-ball": "bounceBall 1.2s ease-in-out infinite",
        "spin-fast": "spinFast 0.9s linear infinite",
        pop: "pop 220ms ease-out both",
      },
    },
  },
  plugins: [],
};
