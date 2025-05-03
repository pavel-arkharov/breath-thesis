/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  // Add safelist to ensure critical classes are included in production
  safelist: [
    'text-neon-green',
    'text-neon-blue',
    'text-neon-pink',
    'dark:text-neon-green',
    'dark:text-neon-blue',
    'dark:text-neon-pink',
    'dark:hover:bg-neon-pink/20'
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk-style dark mode colors
        'dark': {
          DEFAULT: '#0D0D0D', // Almost black background
          50: '#181818',      // Slightly lighter black
          100: '#222222',     // Light black
          200: '#141414',     // Slightly lighter dark
          800: '#0A0A0A',     // Darker black
          900: '#050505',     // Darkest black
        },
        'neon': {
          green: '#00FF85',   // Neon green
          blue: '#1E90FF',    // Electric blue
          pink: '#FF0099',    // Vivid pink
        },
      }
    },
  },
  plugins: [],
} 