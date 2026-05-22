/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7dc8fb',
          400: '#38aaf6',
          500: '#0e90e7',
          600: '#0272c5',
          700: '#035aa0',
          800: '#074d84',
          900: '#0b416d',
          950: '#072948',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8f9fb',
          100: '#f1f3f7',
          200: '#e8eaf0',
          300: '#d5d9e4',
        },
      },
      boxShadow: {
        'xs':         '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card':       '0 0 0 1px rgb(0 0 0 / 0.05), 0 2px 8px 0 rgb(0 0 0 / 0.06)',
        'card-hover': '0 0 0 1px rgb(0 0 0 / 0.08), 0 4px 16px 0 rgb(0 0 0 / 0.10)',
        'modal':      '0 0 0 1px rgb(0 0 0 / 0.06), 0 24px 48px -12px rgb(0 0 0 / 0.18)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
