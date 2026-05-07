// Commons 4.13.x added babel-plugin-module-resolver with `root: ["./src"]`,
// which rewrites `import Editor from "."` (in v1's `src/components/Editor/
// FormikEditor.jsx`) to a path relative to `src/`, ending up at `src/index.js`
// and breaking the bundle. We keep the plugin for its dayjs alias redirects
// and only neutralize the `root` setting.
const baseConfig = require("@bigbinary/neeto-commons-frontend/configs/babel.js");

module.exports = function (api) {
  const config = baseConfig(api);
  config.plugins = config.plugins.map(plugin => {
    if (Array.isArray(plugin) && plugin[0] === "module-resolver") {
      const [name, options] = plugin;

      return [name, { ...options, root: [] }];
    }

    return plugin;
  });

  return config;
};
