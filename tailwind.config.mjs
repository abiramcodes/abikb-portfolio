/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte,mdx,md}"],
  theme: {
    extend: {
      colors: {
        bench: {
          DEFAULT: "var(--bench)",
          2: "var(--bench-2)",
          3: "var(--bench-3)",
          text: "var(--bench-text)",
          muted: "var(--bench-muted)",
          dim: "var(--bench-dim)",
          line: "var(--bench-line)",
        },
        chassis: {
          DEFAULT: "var(--chassis)",
          deep: "var(--chassis-deep)",
        },
        panel: {
          DEFAULT: "var(--panel)",
          2: "var(--panel-2)",
        },
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        smoked: {
          DEFAULT: "var(--smoked)",
          text: "var(--smoked-text)",
          muted: "var(--smoked-muted)",
        },
        metal: {
          DEFAULT: "var(--metal-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          strong: "var(--accent-strong)",
        },
        leda: "var(--led-side-a)",
        ledb: "var(--led-side-b)",
        focus: "var(--focus)",
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        display: ["Archivo", "system-ui", "sans-serif"],
      },
    },
  },
};
