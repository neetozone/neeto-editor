import { ALL_PROTOCOL_URL_REGEXP, EDITOR_OPTIONS } from "common/constants";
import { t } from "i18next";
import * as yup from "yup";

export const DEFAULT_EDITOR_OPTIONS = [
  EDITOR_OPTIONS.BOLD,
  EDITOR_OPTIONS.ITALIC,
  EDITOR_OPTIONS.UNDERLINE,
  EDITOR_OPTIONS.STRIKETHROUGH,
  EDITOR_OPTIONS.LINK,
  EDITOR_OPTIONS.PARAGRAPH,
  EDITOR_OPTIONS.H1,
  EDITOR_OPTIONS.H2,
  EDITOR_OPTIONS.H3,
  EDITOR_OPTIONS.H4,
  EDITOR_OPTIONS.H5,
  EDITOR_OPTIONS.H6,
  EDITOR_OPTIONS.LIST_BULLETS,
  EDITOR_OPTIONS.LIST_ORDERED,
  EDITOR_OPTIONS.CODE,
];
export const EDITOR_PADDING_SIZE = 12;

export const EDITOR_BORDER_SIZE = 1;

export const EDITOR_LINE_HEIGHT = 21;

export const IMAGE_REGEX = new RegExp(/(<img[^>]*?>)(?![\s\S]*<\/figure>)/g);
export const IMAGE_REPLACEMENT_PATTERN = "<figure>$1</figure>";
export const EMPTY_DIV_REGEX = new RegExp(
  /<div[^>]*?>\s*(?:<br[^>]*?>)\s*<\/div>/g
);
export const TRAILING_BR_REGEX = new RegExp(/\s*(?:<br[^>]*?>)+\s*$/);

export const LINK_VALIDATION_SCHEMA = yup.object().shape({
  textContent: yup.string().required(t("neetoEditor.error.textRequired")),
  urlString: yup
    .string()
    .matches(ALL_PROTOCOL_URL_REGEXP, t("neetoEditor.error.invalidUrl"))
    .required(t("neetoEditor.error.urlRequired")),
});
