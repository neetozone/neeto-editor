import { EDITOR_OPTIONS } from "src/common/constants";

import Mentions from "src/v2/components/Editor/CustomExtensions/Mention";

import MenuButton from "./components/Button";
import CalloutDropdown from "./components/CalloutDropdown";
import EmojiOption from "./components/EmojiOption";
import FontSizeOption from "./components/FontSizeOption";
import HighlightDropdown from "./components/HighlightDropdown/index.jsx";
import TableOption from "./components/TableOption";
import TextColorOption from "./components/TextColorOption";

export const MENU_ELEMENT_TYPES = {
  BUTTON: "button",
  CALLOUT: "callout",
  FONT_SIZE: "fontSize",
  TABLE: "table",
  TEXT_COLOR: "textColor",
  EMOJI: "emoji",
  MENTIONS: "mentions",
  HIGHLIGHT: "highlight",
};

export const MENU_TYPES = {
  HISTORY: "history",
  FONT: "font",
  LIST: "list",
  BLOCK: "block",
  MISC: "misc",
  EXTRAS: "extras",
  CUSTOM: "custom",
};

export const SHORTCUTS = {
  [EDITOR_OPTIONS.BOLD]: { mac: "⌘B", win: "Ctrl+B" },
  [EDITOR_OPTIONS.ITALIC]: { mac: "⌘I", win: "Ctrl+I" },
  [EDITOR_OPTIONS.UNDERLINE]: { mac: "⌘U", win: "Ctrl+U" },
  [EDITOR_OPTIONS.STRIKETHROUGH]: {
    mac: "⌘⇧S or ⌘⇧X",
    win: "Ctrl+Shift+S or Ctrl+Shift+X",
  },
  [EDITOR_OPTIONS.CODE]: { mac: "⌘E", win: "Ctrl+E" },
  [EDITOR_OPTIONS.UNDO]: { mac: "⌘Z", win: "Ctrl+Z" },
  [EDITOR_OPTIONS.REDO]: { mac: "⌘⇧Z", win: "Ctrl+Shift+Z" },
  [EDITOR_OPTIONS.LINK]: { mac: "⌘K", win: "Ctrl+K" },
  [EDITOR_OPTIONS.HIGHLIGHT]: { mac: "⌘⇧H", win: "Ctrl+Shift+H" },
  bulletList: { mac: "⌘⇧8", win: "Ctrl+Shift+8" },
  orderedList: { mac: "⌘⇧7", win: "Ctrl+Shift+7" },
  todoList: { mac: "⌘⇧9", win: "Ctrl+Shift+9" },
};

export const MENU_ELEMENTS = {
  [MENU_ELEMENT_TYPES.BUTTON]: MenuButton,
  [MENU_ELEMENT_TYPES.CALLOUT]: CalloutDropdown,
  [MENU_ELEMENT_TYPES.FONT_SIZE]: FontSizeOption,
  [MENU_ELEMENT_TYPES.TABLE]: TableOption,
  [MENU_ELEMENT_TYPES.TEXT_COLOR]: TextColorOption,
  [MENU_ELEMENT_TYPES.EMOJI]: EmojiOption,
  [MENU_ELEMENT_TYPES.MENTIONS]: Mentions,
  [MENU_ELEMENT_TYPES.HIGHLIGHT]: HighlightDropdown,
};

export const MENU_ELEMENT_WIDTHS = {
  [MENU_ELEMENT_TYPES.BUTTON]: 36,
  [MENU_ELEMENT_TYPES.CALLOUT]: 23,
  [MENU_ELEMENT_TYPES.FONT_SIZE]: 103,
  [MENU_ELEMENT_TYPES.TABLE]: 36,
  [MENU_ELEMENT_TYPES.TEXT_COLOR]: 36,
  [MENU_ELEMENT_TYPES.EMOJI]: 36,
  [MENU_ELEMENT_TYPES.MENTIONS]: 36,
  [MENU_ELEMENT_TYPES.HIGHLIGHT]: 103,
};
