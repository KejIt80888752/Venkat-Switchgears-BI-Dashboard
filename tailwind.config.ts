import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        venkat: {
          navy: "#0D2B5E",
          "navy-dark": "#091E45",
          "navy-light": "#1A3D7A",
          "navy-muted": "#8BAED6",
          orange: "#E87722",
          "orange-dark": "#D0661A",
          "orange-light": "#F59040",
        },
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
