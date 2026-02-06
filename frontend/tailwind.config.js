/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        visualgo: {
          black: '#111',
          orange: '#dd6e00',
          'orange-light': '#ff8c00',
          gray: '#eaeaea',
          'gray-dark': '#eee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
