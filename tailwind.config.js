/** @type {import('tailwindcss').Config} */
var colors = require("tailwindcss/colors");
var theme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./app/**/*.{js,ts,tsx,jsx}"],
  theme: {
    extend: {
      fontSize: {
        xx: ["0.625rem", { lineHeight: "1rem", letterSpacing: "0.025" }],
      },
      screens: {
        "3xl": "1728px",
      },

      fontFamily: {
        sans: ["Inter var", ...theme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial-t":
          "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
      },
    },
    colors: {
      white: "white",
      black: "black",
      transparent: "transparent",
      gray: colors.gray,

      brand: {
        DEFAULT: "#8000FF",
        100: "#F1E6FF",
        300: "#D4BAF7",
        500: "#8000FF",
        700: "#5814B8",
        900: "#3B1782",
      },

      info: colors.indigo,
      error: colors.red,
      alert: colors.yellow,
      success: colors.emerald,

      feed: colors.yellow,
      reels: colors.orange,
      task: colors.rose,
      stories: colors.pink,
      meeting: colors.purple,
      print: colors.indigo,
      tiktok: colors.sky,
      financial: colors.emerald,
      webdev: colors.lime,
      ads: colors.green,

      idea: colors.yellow,
      do: colors.orange,
      doing: colors.pink,
      review: colors.violet,
      done: colors.blue,
      accomplished: colors.lime,
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};
