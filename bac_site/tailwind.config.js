module.exports = {
  content: [
    "./backend/views/**/*.ejs",
    "./views/**/*.ejs", // ✅ Ajoute cette ligne
    "./public/**/*.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
