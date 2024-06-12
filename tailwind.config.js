/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fill: {
        "purple-600": "#7C3AED",
      },
    },
  },
  variants: {
    fill: ["hover"],
  },
  plugins: [],
};
