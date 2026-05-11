import defaultConfigurations from "@bigbinary/neeto-commons-frontend/configs/nanos/eslint/index.mjs";

const config = [
  {
    ignores: [
      "public/**",
      "coverage/**",
      "db/**",
      "docs/**",
      "log/**",
      ".scripts/**",
      ".semaphore/**",
      "test/**",
      "tmp/**",
      ".vscode/**",
      "app/javascript/packs/**",
      "dist/**",
      "babel.config.js",
      "webpack.config.js",
      "rollup.config.js",
      "tailwind.config.js",
      ".prettierrc.js",
    ],
  },
  ...defaultConfigurations,
  {
    rules: {
      "import/extensions": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["src/v2/**/*.{js,jsx,ts,tsx}", "stories/v2/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@bigbinary/neeto/use-neetoui-classes": "off",
    },
  },
];

export default config;
