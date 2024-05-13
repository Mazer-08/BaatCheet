/** @type {import('tailwindcss').Config} */
const { scrollbarGutter, scrollbarWidth, scrollbarColor } = require('tailwind-scrollbar-utilities');
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    scrollbarGutter(), // no options to configure
    scrollbarWidth(), // no options to configure
    scrollbarColor(), // no options to configure
  ],
}

