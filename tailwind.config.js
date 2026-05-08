const defaultConfigurations = require("@bigbinary/neeto-commons-frontend/configs/nanos/tailwind.js");

// Commons tailwind config injects `@tailwindcss/container-queries` v0.1.x which
// is Tailwind v3 only — it uses `matchVariant` which v4 doesn't expose. Strip it
// since v4 ships container queries natively.
const plugins = (defaultConfigurations.plugins || []).filter(plugin => {
  const name = plugin?.name || plugin?.handler?.name;

  return name !== "containerQueries";
});

module.exports = { ...defaultConfigurations, plugins, important: false };
