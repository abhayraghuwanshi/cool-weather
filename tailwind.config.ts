import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        "cream-dark": "#E8E2D0",
        ink: "#1C1C2E",
        gold: "#F4C430",
        muted: "#8A8FA8",
      },
      fontFamily: {
        display: ["'Abril Fatface'", "serif"],
        body: ["'Crimson Text'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
