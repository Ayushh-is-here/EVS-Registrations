/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--color-background) / <alpha-value>)',
        surface: 'oklch(var(--color-surface) / <alpha-value>)',
        ink: {
          DEFAULT: 'oklch(var(--color-ink) / <alpha-value>)',
          light: 'oklch(var(--color-ink-light) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--color-accent) / <alpha-value>)',
          hover: 'oklch(var(--color-accent-hover) / <alpha-value>)',
          soft: 'oklch(var(--color-accent-soft) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'oklch(var(--color-success) / <alpha-value>)',
          soft: 'oklch(var(--color-success-soft) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'oklch(var(--color-error) / <alpha-value>)',
          soft: 'oklch(var(--color-error-soft) / <alpha-value>)',
        },
        warn: {
          DEFAULT: 'oklch(var(--color-warn) / <alpha-value>)',
          soft: 'oklch(var(--color-warn-soft) / <alpha-value>)',
        },
        border: 'oklch(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['Outfit', '-apple-system', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.06), 0 20px 48px rgba(0, 0, 0, 0.08)',
        'lg': '0 4px 12px rgba(0, 0, 0, 0.06), 0 20px 48px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(var(--color-accent), 0.3)',
      }
    },
  },
  plugins: [],
}
