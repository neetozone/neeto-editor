import { t } from "i18next";
import { lowlight } from "lowlight";

export const SORTED_LANGUAGE_LIST = [
  ...lowlight.listLanguages(),
  "html",
].sort();

export const LINE_NUMBER_OPTIONS = [
  { label: t("neetoEditor.codeblock.showLineNumbers"), value: "true" },
  { label: t("neetoEditor.codeblock.hideLineNumbers"), value: "false" },
];
