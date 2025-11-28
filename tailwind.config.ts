import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--card-border)",
        card: {
          DEFAULT: "var(--card-bg)",
          border: "var(--card-border)",
        },
        primary: "var(--brand-purple)",
        secondary: "var(--brand-orange)",
      },
    },
  },
  plugins: [],
};
export default config;



