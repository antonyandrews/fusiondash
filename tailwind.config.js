/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Map Tailwind colors to our Material Azure Theme
        primary: {
          DEFAULT: 'var(--mat-sys-primary)',
          foreground: 'var(--mat-sys-on-primary)',
          container: 'var(--mat-sys-primary-container)',
          'container-foreground': 'var(--mat-sys-on-primary-container)',
        },
        surface: {
          DEFAULT: 'var(--mat-sys-surface)',
          foreground: 'var(--mat-sys-on-surface)',
        },
        // Fallback colors for when variables aren't loaded yet
        'primary-fallback': '#0284c7', // Sky-600
        'surface-fallback': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}