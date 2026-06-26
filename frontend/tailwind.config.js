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
        cardBg: '#ffffff', // White
        brandBlue: '#0284c7', // Sky 600
        brandGreen: '#059669', // Emerald 600
        brandOrange: '#ea580c', // Orange 600
        cyberCyan: '#0369a1', // Sky 700
        brandGold: '#b45309', // Amber 700
        cyberPurple: '#7c3aed' // Violet 600
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {}
    },
  },
  plugins: [],
}
