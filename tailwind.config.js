/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        med: {
          50: '#eff8ff',
          100: '#dbeefe',
          500: '#2584ff',
          600: '#1468d6',
          700: '#0f4ea7',
        },
        risk: {
          low: '#14b8a6',
          medium: '#f59e0b',
          high: '#ef4444',
        },
      },
      boxShadow: {
        card: '0 8px 30px rgba(15, 78, 167, 0.08)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.08)', opacity: '0' },
          '100%': { transform: 'scale(1.08)', opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.45s ease-out',
        pulseRing: 'pulseRing 1.4s ease-out infinite',
      },
    },
  },
  plugins: [],
};
