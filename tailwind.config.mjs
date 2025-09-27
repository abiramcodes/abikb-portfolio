/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Background / Base
        charcoal: "#1A1A1A",
        "smoky-gray": "#2C2A2A",

        // Primary Accents
        "vintage-beige": "#D4A373",
        "burnt-sienna": "#A0522D",
        "antique-tan": "#E1C699",

        // Secondary Accents
        "olive-green": "#6B8E23",
        "steel-blue": "#4682B4",
        "retro-magenta": "#C71585",

        // Highlight
        "mustard-yellow": "#FFD580",

        // Optional: Create semantic color groups
        retro: {
          // Background variants
          bg: {
            primary: "#1A1A1A", // charcoal
            secondary: "#2C2A2A", // smoky-gray
          },
          // Primary palette
          primary: {
            50: "#F5F0E8",
            100: "#E1C699", // antique-tan
            200: "#D4A373", // vintage-beige
            300: "#A0522D", // burnt-sienna
            400: "#8B4513",
            500: "#A0522D",
            600: "#8B4513",
            700: "#654321",
            800: "#4A2C17",
            900: "#2F1B0C",
          },
          // Accent colors
          accent: {
            olive: "#6B8E23",
            steel: "#4682B4",
            magenta: "#C71585",
            mustard: "#FFD580",
          },
        },
      },
      // Optional: Extend other theme properties for your retro theme
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
        bebas: ["BebasNeue", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
        // Custom sizes
        huge: ["10rem", { lineHeight: "1" }],
        display: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      backdropBlur: {
        retro: "8px",
      },
    },
  },
  plugins: [],
};
