/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "var(--navy)",
          surface: "var(--navy-surface)",
          soft: "var(--navy-soft)",
        },
        coral: "var(--coral)",
        amber: "var(--amber)",
        ink: "var(--ink)",
        muted: "var(--muted)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "coral-gradient": "linear-gradient(120deg, var(--coral) 0%, var(--amber) 100%)",
      },
      borderRadius: {
        btn: "var(--btn-radius)",
      },
    },
  },
  plugins: [],
}
