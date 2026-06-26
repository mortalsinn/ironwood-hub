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
        darkBg: '#0b1120',
        cardBg: 'rgba(15, 23, 42, 0.6)',
        brandBlue: '#0ea5e9', // Cyber blue
        brandGreen: '#10b981', // Neon green
        brandOrange: '#f97316',
        cyberCyan: '#06b6d4',
        cyberPurple: '#8b5cf6'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
