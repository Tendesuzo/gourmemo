/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#E0E1DD",
        brandLight: "#1B263B",
        text: "#E0E1DD",
        text2: "#CC5500",
      },
    },
  },
  plugins: [],
};
