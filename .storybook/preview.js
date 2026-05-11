import "../src/v2/styles/tailwind.css";
import "../src/index.scss";
import "../src/v2/styles/index.scss";
import "./style.scss";
import { themes } from "@storybook/theming";
import { addons } from "@storybook/manager-api";
import { LIVE_EXAMPLES_ADDON_ID } from "storybook-addon-live-examples";
import initializeApplication from "neetocommons/initializers";
import en from "../src/translations/en.json";
import neetoTheme from "./neetoTheme";
import DocsContainer from "./docs/container";

initializeApplication({
  skip: { axios: true, globalProps: false, mixpanel: true, logger: true },
  translationResources: { en: { translation: en } },
});

addons.setConfig({
  [LIVE_EXAMPLES_ADDON_ID]: {},
});

export const parameters = {
  layout: "fullscreen",
  docs: { container: DocsContainer },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  options: {
    storySort: {
      order: [
        "Welcome",
        "Getting started",
        "Walkthroughs",
        ["Menu", "MenuTypes"],
        "API Reference",
        ["Props", "Editor API"],
        "Examples",
        [
          "Basic",
          "Customize options",
          ["Addons", "Override defaults", "Custom slash commands"],
        ],
        "Accessibility",
        "V2 (neeto-atoms)",
        [
          "Welcome",
          "Getting started",
          "Walkthroughs",
          ["Menu", "MenuTypes"],
          "API-Reference",
          ["Props", "Editor API"],
          "Examples",
          [
            "Basic",
            "Customize options",
            ["Addons", "Override defaults", "Custom slash commands"],
          ],
          "Accessibility",
        ],
      ],
    },
  },
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, ...neetoTheme },
    // Override the default light theme
    light: { ...themes.normal, ...neetoTheme },
    current: "light",
    // Apply both v1 (.neeto-ui-theme--*) and v2 (.dark) classes so stories from
    // either era render in the correct theme.
    darkClass: ["neeto-ui-theme--dark", "dark"],
    lightClass: ["neeto-ui-theme--light"],
    classTarget: "body",
    stylePreview: true,
  },
};
