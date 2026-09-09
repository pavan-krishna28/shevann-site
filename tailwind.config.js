/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0E1526",
          surface: "#131B2E",
          soft: "#1B2540",
        },
        coral: "#FF6B4A",
        amber: "#FFA630",
        ink: "#F5F3EF",
        muted: "#8B93A7",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        "coral-gradient": "linear-gradient(120deg, #FF6B4A 0%, #FFA630 100%)",
      },
    },
  },
  plugins: [],
}
