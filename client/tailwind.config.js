/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          450: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#3b2fd9',
        },
        accent: {
          violet:      '#7c3aed',
          fuchsia:     '#d946ef',
          emerald:     '#10b981',
          rose:        '#f43f5e',
          cyan:        '#06b6d4',
          neonPurple:  '#a855f7',
        },
        cyber: {
          bg:      '#030712',
          bgCard:  'rgba(15, 23, 42, 0.4)',
          border:  'rgba(99, 102, 241, 0.15)',
          glow:    'rgba(139, 92, 246, 0.15)',
        },
      },
      animation: {
        'gradient-xy':    'gradient-xy 15s ease infinite',
        'float-slow':     'float-slow 8s ease-in-out infinite',
        'float-medium':   'float-medium 5s ease-in-out infinite',
        'laser':          'laser-sweep 3s linear infinite',
        'pulse-subtle':   'pulse-subtle 4s ease-in-out infinite',
        'spin-slow':      'spin-slow 12s linear infinite',
        'shimmer':        'shimmer 3s linear infinite',
        'border-glow':    'border-glow 3s ease-in-out infinite',
        'glow-pulse':     'glow-pulse 3s ease-in-out infinite',
        'orbit':          'orbit 6s linear infinite',
        'blink':          'blink 1s step-end infinite',
        'aurora-1':       'aurora-drift-1 18s ease-in-out infinite',
        'aurora-2':       'aurora-drift-2 22s ease-in-out infinite',
        'aurora-3':       'aurora-drift-3 25s ease-in-out infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':       { 'background-position': '100% 50%' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':       { transform: 'translateY(-18px) rotate(1deg)' },
          '66%':       { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        'laser-sweep': {
          '0%':   { top: '-2px' },
          '100%': { top: '100%' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':       { opacity: '1',   transform: 'scale(1.04)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%':   { 'background-position': '-200% center' },
          '100%': { 'background-position':  '200% center' },
        },
        'border-glow': {
          '0%, 100%': { 'border-color': 'rgba(99,102,241,0.3)' },
          '50%':       { 'border-color': 'rgba(139,92,246,0.7)' },
        },
        'glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(99,102,241,0.3), 0 0 60px rgba(99,102,241,0.1)' },
          '50%':       { 'box-shadow': '0 0 40px rgba(99,102,241,0.6), 0 0 100px rgba(139,92,246,0.3)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(14px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(14px) rotate(-360deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        'aurora-drift-1': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.5' },
          '25%':       { transform: 'translate(8%, -12%) scale(1.15)', opacity: '0.7' },
          '50%':       { transform: 'translate(15%, 5%) scale(0.95)', opacity: '0.4' },
          '75%':       { transform: 'translate(-5%, 10%) scale(1.1)', opacity: '0.6' },
        },
        'aurora-drift-2': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1.1)', opacity: '0.4' },
          '33%':       { transform: 'translate(-10%, 8%) scale(0.9)', opacity: '0.65' },
          '66%':       { transform: 'translate(12%, -10%) scale(1.2)', opacity: '0.5' },
        },
        'aurora-drift-3': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(0.95)', opacity: '0.3' },
          '50%':       { transform: 'translate(6%, 14%) scale(1.15)', opacity: '0.6' },
        },
      },
      backgroundSize: {
        '200%': '200%',
      },
    },
  },
  plugins: [],
};
