import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111014",
        club: "#1473e6",
        "club-light": "#5c9eff",
        graphite: "#15161d",
      },
      boxShadow: {
        blue: "0 18px 55px rgba(20, 115, 230, 0.28)",
        "blue-soft": "0 28px 90px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
