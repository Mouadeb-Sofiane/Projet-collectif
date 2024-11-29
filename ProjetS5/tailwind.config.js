module.exports = {
  content: [
    "./index.html", // Si vous avez un fichier HTML
    "./src/**/*.{vue,js,ts,jsx,tsx}" // Si vous utilisez Vue.js
  ],
  theme: {
    extend: {
      colors: {
        'oranges': '#FFA559',
        'rouges': '#FF0000',
      },
    },
  },
  plugins: [],
}
