/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'electric': {
          50: '#e6fcff',
          100: '#b3f5ff',
          200: '#80eeff',
          300: '#4de7ff',
          400: '#1ae0ff',
          500: '#00d4e6',
          600: '#00a8b8',
          700: '#007c8a',
          800: '#00505c',
          900: '#00242e',
        },
        'dark': {
          50: '#f5f7fb',
          100: '#e2e6ef',
          200: '#c9d1df',
          300: '#9aa4c6',
          400: '#6b7280',
          500: '#151b3a',
          600: '#0b1020',
          700: '#050816',
          800: '#02030a',
          900: '#010205',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 224, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 224, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
