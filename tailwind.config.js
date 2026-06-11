/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
      '2xl': '1400px',
    },
    extend: {},
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '0.75rem',
          paddingRight: '0.75rem',
          '@media (min-width: 576px)': { maxWidth: '540px' },
          '@media (min-width: 768px)': { maxWidth: '720px' },
          '@media (min-width: 992px)': { maxWidth: '960px' },
          '@media (min-width: 1200px)': { maxWidth: '1140px' },
          '@media (min-width: 1400px)': { maxWidth: '1320px' },
        }
      })
    }
  ],
}
