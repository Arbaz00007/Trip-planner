/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8870e6",
        darkPrimary:"#6146cd",
        lightPrimary:"#ad99fe",
        sliver: "#c0c0c0",
        bgbtn: "#f1f1f1",
        bgbtnHover: "#d6d6d6",
      },
      fontFamily: {
        heading: ["Roboto Condensed", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
