import { lowlight } from "lowlight";

export const EDITOR_CONTENT_CLASS_NAME = "neeto-editor-content";

export const SANITIZE_OPTIONS = {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: ["target", "allow", "allowfullscreen", "frameborder"],
};

export const CODE_BLOCK_REGEX =
  /<pre(?:\s+[^>]+)?><code(?:\s+class="language-([^"]*)")?>([\S\s]*?)<\/code><\/pre>/gim;

export const VARIABLE_SPAN_REGEX =
  /<span data-variable="" [^>]*data-label="([^"]+)">{{([^}]+)}}<\/span>/g;

export const LANGUAGE_LIST = [...lowlight.listLanguages(), "html"];

export const EDITOR_CONTENT_DEFAULT_CONFIGURATION = {
  enableHeaderLinks: false,
};
