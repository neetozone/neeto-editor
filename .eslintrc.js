const defaultConfigurations = require("@bigbinary/neeto-commons-frontend/configs/nanos/eslint/index.js");
const { mergeDeepLeft } = require("ramda");

module.exports = mergeDeepLeft(
  {
    extends: defaultConfigurations.extends,
    rules: {
      "import/extensions": "off",
      "react/react-in-jsx-scope": "off",
    },
    overrides: [
      {
        files: ["src/v2/**/*.{js,jsx,ts,tsx}", "stories/v2/**/*.{js,jsx,ts,tsx}"],
        rules: {
          "@bigbinary/neeto/use-neetoui-classes": "off",
        },
      },
    ],
  },
  defaultConfigurations
);
