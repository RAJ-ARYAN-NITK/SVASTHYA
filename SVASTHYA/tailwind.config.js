// tailwind.config.js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}", // Add this
    "./components/**/*.{js,jsx,ts,tsx}" // Add this if you have components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}