module.exports = {
  plugins: [
    require("@tailwindcss/postcss"),
    require("postcss-preset-env")({
      autoprefixer: {
        flexbox: "no-2009",
      },
      stage: 3,
    }),
    require("cssnano"),
  ],
};
