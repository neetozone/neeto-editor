import { Slice, Fragment, Node } from "@tiptap/pm/model";
import { Selection } from "@tiptap/pm/state";
import { isNotEmpty } from "neetocist";

import { ALL_PROTOCOL_URL_REGEXP, EDITOR_OPTIONS } from "src/common/constants";

import {
  EDITOR_LINE_HEIGHT,
  EDITOR_BORDER_SIZE,
  EDITOR_PADDING_SIZE,
  IMAGE_REGEX,
  IMAGE_REPLACEMENT_PATTERN,
  EMPTY_DIV_REGEX,
  TRAILING_BR_REGEX,
} from "./constants";

export const getEditorStyles = ({ rows }) => {
  const editorHeight =
    rows * EDITOR_LINE_HEIGHT + 2 * (EDITOR_PADDING_SIZE + EDITOR_BORDER_SIZE);

  return `min-height: ${editorHeight}px;`;
};

export const clipboardTextParser = (text, context) => {
  const nodes = [];
  const blocks = text.split(/\n/);

  blocks.forEach(line => {
    const nodeJson = { type: "paragraph" };
    if (isNotEmpty(line)) {
      nodeJson.content = [{ type: "text", text: line }];
    }
    const node = Node.fromJSON(context.doc.type.schema, nodeJson);
    nodes.push(node);
  });

  const fragment = Fragment.fromArray(nodes);

  return Slice.maxOpen(fragment);
};

export const setInitialPosition = editor => {
  const { state, view } = editor;
  const endPosition = Selection.atEnd(state.doc);
  const transaction = state.tr;
  transaction.setSelection(endPosition);
  view.dispatch(transaction);
};

export const isEditorOverlaysActive = () =>
  document.querySelector(
    ".ne-media-uploader,.ne-embed-modal,.tippy-content,.ne-link-popover"
  );

export const validateAndFormatUrl = url => {
  if (!ALL_PROTOCOL_URL_REGEXP.test(url)) {
    return null;
  }

  if (!/^[a-zA-Z]\w*:/i.test(url)) {
    return `https://${url}`;
  }

  return url;
};

export const transformEditorContent = content =>
  content
    ?.replaceAll(IMAGE_REGEX, IMAGE_REPLACEMENT_PATTERN)
    ?.replaceAll(EMPTY_DIV_REGEX, "")
    ?.replace(TRAILING_BR_REGEX, "");

export const isEmojiSuggestionsMenuActive = () =>
  !!document.querySelector(".neeto-editor-emoji-suggestion");

export const transformPastedHTML = content => {
  const contentWithoutBr = content.replaceAll("<br />", "<p></p>");
  const doc = new DOMParser().parseFromString(contentWithoutBr, "text/html");

  doc.querySelectorAll("[style]").forEach(el => {
    el.style.color = "";
    el.style.backgroundColor = "";
  });

  return doc.body.innerHTML;
};

export const buildLevelsFromOptions = options => {
  const levels = {
    [EDITOR_OPTIONS.H1]: 1,
    [EDITOR_OPTIONS.H2]: 2,
    [EDITOR_OPTIONS.H3]: 3,
    [EDITOR_OPTIONS.H4]: 4,
    [EDITOR_OPTIONS.H5]: 5,
    [EDITOR_OPTIONS.H6]: 6,
  };

  return Object.entries(levels)
    .filter(heading => options.includes(heading[0]))
    .map(heading => heading[1]);
};
