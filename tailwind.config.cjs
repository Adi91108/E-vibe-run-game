// Tailwind config for Vite: https://tailwindcss.com/docs/installation/using-vite
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['"Fredoka"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
