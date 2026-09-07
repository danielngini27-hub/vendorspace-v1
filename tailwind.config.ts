import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // VENDLY DESIGN SYSTEM
      colors: {
        vendly: {
          // Backgrounds
          background: "#0B1120",
          surface: "#151E32",
          elevated: "#1E293B",

          // Brand Accents
          primary: "#0284C7",
          accent: "#06B6D4",

          // Text
          text: "#F8FAFC",
          muted: "#94A3B8",

          // Borders
          border: "rgba(255, 255, 255, 0.08)",

          // Semantic
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      backgroundImage: {
        "vendly-gradient": "linear-gradient(135deg, #0B1120 0%, #151E32 100%)",
        "hero-gradient": "linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
