/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'sm': '0.5rem', // Or your desired border radius size
      },
    },
  },
  plugins: [],
}