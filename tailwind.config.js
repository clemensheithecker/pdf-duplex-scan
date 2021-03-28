const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./index.html", "./main.js"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: colors.blue,
      green: colors.green,
      red: colors.red,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
