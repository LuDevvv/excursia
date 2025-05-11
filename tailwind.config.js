/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-darker)',
        'primary-light': 'var(--primary-lighter)',
        secondary: 'var(--secondary)',
        'secondary-dark': 'var(--secondary-darker)',
        'secondary-light': 'var(--secondary-lighter)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
