// Commons 4.13.x added babel-plugin-module-resolver with `root: ["./src"]`,
// which rewrites `import Editor from "."` (in v1's `src/components/Editor/
// FormikEditor.jsx`) to a path relative to `src/`, ending up at `src/index.js`
// and breaking the bundle. The editor already has jsconfig + rollup/webpack
// aliases for absolute import resolution, so the plugin is not needed here.
const baseConfig = require("@bigbinary/neeto-commons-frontend/configs/babel.js");

module.exports = function (api) {
  const config = baseConfig(api);
  config.plugins = config.plugins.filter(
    plugin => !(Array.isArray(plugin) && plugin[0] === "module-resolver")
  );

  return config;
};
