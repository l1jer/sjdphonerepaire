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
        primary: {
          DEFAULT: '#4A6CF7',  // Main blue colour
          hover: '#3151D3',    // Darker blue for hover states
          light: '#E9EFFF',    // Light blue background
        },
        dark: {
          DEFAULT: '#090E34',  // Dark text/background
          text: '#959CB1',     // Secondary text
        },
        body: {
          DEFAULT: '#959CB1',  // Body text colour
          background: '#F4F7FF' // Light background
        },
      },
    },
  },
  plugins: [],
}

export default config;
