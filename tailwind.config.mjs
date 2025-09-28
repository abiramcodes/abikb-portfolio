/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // toggle dark mode by adding 'dark' to <html> or <body>
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte,mdx,md}"],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#222325", // neutral-900
        },
        foreground: {
          light: "#222325", // text primary (light)
          dark: "#f9fafb", // text primary (dark)
        },
        muted: {
          light: "#f9fafb", // neutral-50
          dark: "#1f2937", // neutral-800
        },
        secondary: {
          light: "#6b7280", // neutral-500
          dark: "#9ca3af", // neutral-400
        },
        accent: {
          DEFAULT: "#839788", // blue-600
        },
      },
      backgroundImage: {
        "subtle-light": "linear-gradient(to bottom right, #f9fafb, #ffffff)",
        "subtle-dark": "linear-gradient(to bottom right, #222325, #0f172a)",
      },
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground.light"),
            a: { color: theme("colors.accent.DEFAULT"), fontWeight: "500" },
            strong: { color: theme("colors.foreground.light") },
            p: { color: theme("colors.secondary.light") },
            h1: { color: theme("colors.foreground.light") },
            h2: { color: theme("colors.foreground.light") },
            h3: { color: theme("colors.foreground.light") },
            blockquote: { color: theme("colors.secondary.light") },
          },
        },
        dark: {
          css: {
            color: theme("colors.foreground.dark"),
            a: { color: theme("colors.accent.light") },
            strong: { color: theme("colors.foreground.dark") },
            p: { color: theme("colors.secondary.dark") },
            h1: { color: theme("colors.foreground.dark") },
            h2: { color: theme("colors.foreground.dark") },
            h3: { color: theme("colors.foreground.dark") },
            blockquote: { color: theme("colors.secondary.dark") },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
