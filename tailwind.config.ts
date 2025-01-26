import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#A31D1D',    // Main red color
          light: '#B83232',      // Lighter red for hover
          dark: '#8A1818',       // Darker red
        },
        background: {
          light: '#FEF9E1',      // Light cream background
          DEFAULT: '#E5D0AC',    // Darker cream background
          dark: '#2C1810',       // Dark brown for dark mode
          darker: '#1A0F0A',     // Darker brown for dark mode elements
        },
        text: {
          DEFAULT: '#A31D1D',    // Main text color
          light: '#B83232',      // Lighter text
          dark: '#8A1818',       // Darker text
          inverse: '#FEF9E1',    // Light text for dark mode
        },
        neutral: {
          50: '#FEF9E1',        // Lightest cream
          100: '#F7ECC8',       // Very light cream
          200: '#E5D0AC',       // Light cream
          300: '#D4B48E',       // Medium cream
          400: '#B89670',       // Dark cream
          500: '#96754E',       // Very dark cream
          600: '#755A3D',       // Brown
          700: '#5C462F',       // Dark brown
          800: '#2C1810',       // Very dark brown
          900: '#1A0F0A',       // Almost black
        },
        accent: {
          DEFAULT: '#FF6B4A',    // Warm orange for accents
          light: '#FF8A6C',      // Light orange
          dark: '#E54D2E',       // Dark orange
        }
      },
    },
  },
  plugins: [],
}

export default config;
