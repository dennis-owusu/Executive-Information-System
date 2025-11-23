/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF6A00',
          50: '#FFF3E6',
          100: '#FFE1BF',
          200: '#FFC090',
          300: '#FFA061',
          400: '#FF8A33',
          500: '#FF6A00',
          600: '#D95600',
          700: '#B24300',
          800: '#8C3500',
          900: '#662700'
        }
      }
    }
  },
  plugins: []
}
