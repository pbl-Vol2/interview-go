const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html", flowbite.content()],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        customBiru: "#DCF2F1",
        customBiru2: "#7FC7D9",
        customBiru3: "#365486",
        customBiru4: "#0F1035",
        customBiru5: "#0B4251",
        customBiru6: "#87BBD7",
        customKuning: "#F2C864",
        secondaryBlack: "#191919",
        secondaryGrey: "#EAEAEA",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), flowbite.plugin()],
};
