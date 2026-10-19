/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cemim: {
          green: "#7CA32B",
          "green-hover": "#6c8f24",
          "green-dark": "#4a6316",
          "green-light": "#ecf4dc",
          gray: "#50555C",
          "gray-light": "#949ba4",
          dark: "#121316",
          surface: "#1A1D23",
          bg: "#FBFBFA"
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"]
      }
    },
  },
  plugins: [],
};
