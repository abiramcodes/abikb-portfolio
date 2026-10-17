/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte,mdx,md}"],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "var(--bg-color-dark, #222325)",
        },
        foreground: {
          dark: "#f9fafb",
        },
        muted: {
          dark: "#1f2937",
        },
        secondary: {
          dark: "#9ca3af",
        },
        accent: {
          DEFAULT: "var(--accent-color, #839788)",
        },
      },
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.foreground.dark"),
            a: { color: theme("colors.accent.DEFAULT"), fontWeight: "500" },
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
};
