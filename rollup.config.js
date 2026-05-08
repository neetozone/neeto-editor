import path from "path";

import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import svgr from "@svgr/rollup";
import { mergeDeepLeft } from "ramda";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import styles from "rollup-plugin-styles";
import { visualizer } from "rollup-plugin-visualizer";
import cleaner from "rollup-plugin-cleaner";

import packageJson from "./package.json";

import { getWatchConfig } from "./rollup-config/watchConfig";

const commonResolve = require("@bigbinary/neeto-commons-frontend/configs/nanos/webpack/resolve.js");
const projectResolve = require("./resolves.js");
const postCssPlugin = require("./rollup-config/postcss.config.js");

const { alias: aliasEntries } = mergeDeepLeft(projectResolve, commonResolve);
const peerDependencies = Object.keys(packageJson.peerDependencies);

const formats = ["esm", "cjs"];

// v1 (neetoUI-based) entries — outputs to `dist/*` and `dist/cjs/*`
const v1Input = {
  index: "./src/index.js",
  Editor: "./src/components/Editor",
  EditorContent: "./src/components/EditorContent",
  Menu: "./src/components/Editor/Menu",
  FormikEditor: "./src/components/Editor/FormikEditor",
  Attachments: "./src/components/Attachments",
  utils: "./src/utils",
  constants: "./src/constants",
};

// v2 (neeto-atoms-based) entries — outputs to `dist/v2/*` and `dist/cjs/v2/*`.
// Mirrors v1Input one-for-one so babel-plugin-transform-imports can rewrite
// bare-barrel imports (`{ Editor } from "@bigbinary/neeto-editor/v2"`) to
// subpaths (`@bigbinary/neeto-editor/v2/Editor`) without breaking.
const v2Input = {
  "v2/index": "./src/v2/index.js",
  "v2/Editor": "./src/v2/components/Editor",
  "v2/EditorContent": "./src/v2/components/EditorContent",
  "v2/Menu": "./src/v2/components/Editor/Menu",
  "v2/FormikEditor": "./src/v2/components/Editor/FormikEditor",
  "v2/Attachments": "./src/v2/components/Attachments",
};

const input = { ...v1Input, ...v2Input };

const plugins = [
  peerDepsExternal(),
  alias({ entries: aliasEntries }),
  json(),
  svgr(),
  replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  }),
  resolve({
    preferBuiltins: true,
    extensions: [".js", ".jsx", ".svg", ".json"],
    moduleDirectories: ["node_modules"],
  }),
  commonjs({ include: /\**node_modules\**/ }),
  babel({
    exclude: "node_modules/**",
    babelHelpers: "runtime",
  }),
  styles({
    extensions: [".css", ".scss", ".min.css"],
  }),
];

const config = args => {
  const { watchPlugins, appPath } = getWatchConfig();
  const destination = args.app ? appPath : __dirname;

  const output = formats.map(format => ({
    assetFileNames: "[name][extname]",
    dir: path.join(destination),
    entryFileNames:
      format === "esm" ? "dist/[name].js" : "dist/cjs/[name].cjs.js",
    chunkFileNames:
      format === "esm"
        ? "dist/chunk-[hash].js"
        : "dist/cjs/chunk-[hash].cjs.js",
    format,
    name: "NeetoEditor",
    sourcemap: true,
    exports: "auto",
    interop: "auto",
  }));

  return [
    {
      input,
      external: peerDependencies,
      output,
      plugins: [
        cleaner({ targets: ["./dist/"] }),
        ...plugins,
        // Plugins for local development.
        ...watchPlugins,
        visualizer({ filename: "./dist/editor-stats.html" }),
      ].filter(Boolean),
    },
    {
      input: "./src/styles/editor-output.scss",
      output: {
        dir: `${__dirname}/dist`,
        format: "esm",
        sourcemap: true,
        assetFileNames: "[name][extname]",
      },
      plugins: [
        styles({
          extensions: [".css", ".scss", ".min.css"],
          mode: ["extract", "editor-content.min.css"],
          minimize: true,
        }),
      ],
    },
    {
      // Input basename `index.scss` would emit `dist/v2/index.js` and clobber
      // the JS barrel from the main bundle. Force a non-colliding stub name;
      // the actual consumable artifact is the extracted `dist/v2/styles.css`.
      input: "./src/v2/styles/index.scss",
      output: {
        dir: `${__dirname}/dist/v2`,
        entryFileNames: "_styles-bundle.js",
        format: "esm",
        sourcemap: true,
        assetFileNames: "[name][extname]",
      },
      plugins: [
        styles({
          extensions: [".css", ".scss", ".min.css"],
          mode: ["extract", "styles.css"],
          minimize: true,
        }),
      ],
      extract: true,
    },
    {
      input: "./src/styles/editor-output-pdf-email.scss",
      output: {
        dir: `${__dirname}/dist`,
        format: "esm",
        sourcemap: true,
        assetFileNames: "[name][extname]",
      },
      plugins: [
        postCssPlugin,
        styles({
          extensions: [".css", ".scss", ".min.css"],
          mode: ["extract", "editor-content.min.css"],
          minimize: true,
        }),
      ],
      extract: true,
    },
    {
      input: "./src/components/EditorContent/codeblockHighlight.js",
      output: {
        dir: `${__dirname}/dist`,
        format: "cjs",
        sourcemap: true,
        assetFileNames: "[name][extname]",
      },
      plugins,
    },
    {
      input: "./src/components/EditorContent/headerLinks.js",
      output: {
        dir: `${__dirname}/dist`,
        format: "cjs",
        sourcemap: true,
        assetFileNames: "[name][extname]",
      },
      plugins,
    },
    {
      input: "./src/components/EditorContent/editorUtils.js",
      output: {
        dir: `${__dirname}/dist`,
        format: "cjs",
        sourcemap: false,
        assetFileNames: "[name][extname]",
      },
    },
  ];
};

export default config;
