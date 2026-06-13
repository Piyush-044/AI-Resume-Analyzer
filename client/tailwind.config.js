/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          450: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#3b2fd9',
        },
        accent: {
          violet: '#7c3aed',
          fuchsia: '#d946ef',
          emerald: '#10b981',
          rose: '#f43f5e',
        },
      },
    },
  },
  plugins: [],
};
