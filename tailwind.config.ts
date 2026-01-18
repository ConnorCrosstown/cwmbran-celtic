import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Note: Primary colors are defined in globals.css using @theme
        // These are kept for backward compatibility
        celtic: {
          blue: "#1e3a8a",
          "blue-dark": "#172554",
          "blue-light": "#2563eb",
          yellow: "#facc15",
          "yellow-dark": "#ca8a04",
          "yellow-light": "#fde047",
          green: "#006633",
          "green-dark": "#004d26",
          white: "#FFFFFF",
          dark: "#0f172a",
          gray: "#475569",
        },
        win: "#22c55e",
        draw: "#f59e0b",
        loss: "#ef4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-oswald)", "Oswald", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
