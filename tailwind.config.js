/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: '#1B6B5A', light: '#E8F4F0', pale: '#F2F9F7', mid: '#2A8A72' },
        danger:   { DEFAULT: '#A63228', light: '#F5ECEA' },
        warning:  { DEFAULT: '#BA7517', light: '#FAEEDA' },
        sidebar:  '#174F41',
      },
      fontFamily: { tajawal: ['Tajawal', 'sans-serif'] },
    },
  },
  plugins: [],
}
