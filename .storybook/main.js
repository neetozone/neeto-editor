const path = require("path");
const commonResolve = require("@bigbinary/neeto-commons-frontend/configs/nanos/webpack/resolve.js");
const projectResolve = require("../resolves.js");
const { mergeDeepLeft } = require("ramda");
const remarkGfm = require("remark-gfm");

const { alias } = mergeDeepLeft(projectResolve, commonResolve);

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],

  staticDirs: ["./public"],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/preset-scss",
    "storybook-dark-mode",
    {
      name: "@storybook/addon-postcss",
      options: {
        cssLoaderOptions: { importLoaders: 1 },
        postcssLoaderOptions: { implementation: require("postcss") },
      },
    },
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    "storybook-addon-live-examples"
  ],

  webpackFinal: async config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...alias,
      // v2: bare entry → src/v2/index.js; sub-paths → src/v2/components/<Name>
      "@bigbinary/neeto-editor/v2$": path.resolve(
        __dirname,
        "../src/v2/index.js"
      ),
      "@bigbinary/neeto-editor/v2": path.resolve(
        __dirname,
        "../src/v2/components"
      ),
      "@bigbinary/neeto-editor": path.resolve(__dirname, "../src/components"),
    };

    config.module.rules.find(
      rule => rule.test && rule.test.test(".svg")
    ).exclude = /^(?!.*\.storybook\/).*\.svg$/;

    config.module.rules.push({
      test: /\.svg$/,
      exclude: __dirname,
      enforce: "pre",
      loader: require.resolve("@svgr/webpack"),
    });

    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@bigbinary\/neeto-commons-frontend\/initializers/,
      use: { loader: "babel-loader", options: { plugins: ["preval"] } },
    });

    config.resolve.extensions.push(".svg");

    return config;
  },

  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
};
