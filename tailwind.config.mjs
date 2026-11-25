/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte,mdx,md}"],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "var(--bg)",
        },
        foreground: {
          dark: "var(--ink)",
        },
        muted: {
          dark: "var(--surface-2)",
        },
        secondary: {
          dark: "var(--muted-text)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        line: "var(--line)",
        accent: {
          DEFAULT: "var(--accent)",
          bg: "var(--accent-bg)",
          2: "var(--accent-2)",
          "2bg": "var(--accent-2-bg)",
        },
        clay: "var(--clay)",
      },
      transitionTimingFunction: {
        // Emil's strong ease-out — the one curve for UI feedback.
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      fontFamily: {
        sans: ["Geist Sans", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["Geist Mono", "ui-monospace", "SF Mono", "Menlo", "monospace"],
        mono: ["Geist Mono", "ui-monospace", "SF Mono", "Menlo", "monospace"],
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
