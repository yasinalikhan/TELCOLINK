/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#050505', // Very dark, almost black
          surface: '#0a0a0a', // Slightly lighter
          panel: 'rgba(20, 20, 20, 0.7)', // Glassmorphism base
          primary: '#00f2ff', // Neon Cyan
          secondary: '#7000ff', // Neon Purple
          accent: '#ff0055', // Neon Pink/Red for alerts
          text: '#e0e0e0',
          muted: '#525252',
          border: '#333333'
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', 'monospace'], // Tech feel
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 10px rgba(0, 242, 255, 0.5)',
        'glow-purple': '0 0 10px rgba(112, 0, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
