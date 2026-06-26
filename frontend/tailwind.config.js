/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a', // Slate 900
        cardBg: 'rgba(30, 41, 59, 0.7)', // Slate 800
        brandBlue: '#38bdf8', // Soft sky blue
        brandGreen: '#10b981', // Emerald green
        brandOrange: '#f59e0b', // Amber
        cyberCyan: '#cbd5e1', // Slate 300
        brandGold: '#c29545', // Ironwood Bronze/Gold
        cyberPurple: '#8b5cf6'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {}
    },
  },
  plugins: [],
}
