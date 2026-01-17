import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        celtic: {
          green: "#006633",
          "green-dark": "#004d26",
          "green-light": "#008040",
          gold: "#FFD700",
          "gold-dark": "#CCA300",
          white: "#FFFFFF",
          dark: "#1a1a1a",
          gray: "#4a4a4a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
