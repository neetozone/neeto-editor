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
import copy from "rollup-plugin-copy";
import { visualizer } from "rollup-plugin-visualizer";
import cleaner from "rollup-plugin-cleaner";

import packageJson from "./package.json";

const commonResolve = require("@bigbinary/neeto-commons-frontend/configs/nanos/webpack/resolve.js");
const projectResolve = require("./resolves.js");
const postCssPlugin = require("./rollup-config/postcss.config.js");

const { alias: aliasEntries } = mergeDeepLeft(projectResolve, commonResolve);
const peerDependencies = Object.keys(packageJson.peerDependencies);

const formats = ["esm", "cjs"];

const emitReadyFile = destination => ({
  name: "emit-ready-file",
  writeBundle: async () => {
    const markerPath = path.join(destination, ".ready");
    require("fs").writeFileSync(
      markerPath,
      `Built at ${new Date().toISOString()}`
    );
  },
});

const input = {
  index: "./src/index.js",
  Editor: "./src/components/Editor",
  EditorContent: "./src/components/EditorContent",
  Menu: "./src/components/Editor/Menu",
  FormikEditor: "./src/components/Editor/FormikEditor",
  Attachments: "./src/components/Attachments",
  utils: "./src/utils",
  constants: "./src/constants",
};

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
  const destination = args.app
    ? path.resolve(__dirname, args.app, "node_modules", packageJson.name)
    : __dirname;
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
  }));

  return [
    {
      input,
      external: peerDependencies,
      output,
      plugins: [
        cleaner({ targets: ["./dist/"] }),
        ...plugins,
        args.app &&
          copy({
            targets: [
              { src: "package.json", dest: destination },
              { src: "types.d.ts", dest: destination },
              { src: "LICENSE.md", dest: destination },
              {
                src: "src/translations",
                dest: path.join(destination, "src/translations"),
              },
            ],
          }),
        args.app && emitReadyFile(destination),
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
