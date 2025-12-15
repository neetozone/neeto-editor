import "../src/index.scss";
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
      ],
    },
  },
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, ...neetoTheme },
    // Override the default light theme
    light: { ...themes.normal, ...neetoTheme },
    current: "light",
    darkClass: "neeto-ui-theme--dark",
    lightClass: "neeto-ui-theme--light",
    classTarget: "body",
    stylePreview: true,
  },
};
