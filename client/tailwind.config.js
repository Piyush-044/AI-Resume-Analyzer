/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
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
          cyan: '#06b6d4',
          neonPurple: '#a855f7',
        },
        cyber: {
          bg: '#030712',
          bgCard: 'rgba(15, 23, 42, 0.4)',
          border: 'rgba(99, 102, 241, 0.15)',
          glow: 'rgba(139, 92, 246, 0.15)',
        }
      },
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'laser': 'laser-sweep 3s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'laser-sweep': {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
};

