import { isNotPresent } from "neetocist";

import { EMPTY_TAGS_TO_REMOVE, NON_EMPTY_TAGS } from "./constants";

const removeTagsStart = node => {
  while (
    node.firstChild &&
    EMPTY_TAGS_TO_REMOVE.includes(node.firstChild.tagName?.toLowerCase())
  ) {
    if (!node.firstChild.innerHTML) {
      node.firstChild.remove();
    } else {
      removeTagsStart(node.firstChild);
      if (node.firstChild.innerHTML) {
        break;
      }
    }
  }
};

const removeTagsEnd = node => {
  while (
    node.lastChild &&
    EMPTY_TAGS_TO_REMOVE.includes(node.lastChild.tagName?.toLowerCase())
  ) {
    if (!node.lastChild.innerHTML) {
      node.lastChild.remove();
    } else {
      removeTagsEnd(node.lastChild);
      if (node.lastChild.innerHTML) {
        break;
      }
    }
  }
};

export const removeEmptyTags = html => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  removeTagsStart(tempDiv);
  removeTagsEnd(tempDiv);

  return tempDiv.innerHTML;
};

export const isEditorEmpty = htmlContent => {
  if (isNotPresent(htmlContent)) return true;

  if (NON_EMPTY_TAGS.some(tag => htmlContent.includes(tag))) return false;

  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  const editorIsEmpty = isNotPresent(element.textContent?.trim());
  element.remove();

  return editorIsEmpty;
};

export const isEditorContentWithinLimit = (htmlContent, maxLength) => {
  if (isNotPresent(htmlContent)) return true;

  const element = document.createElement("div");
  element.innerHTML = htmlContent;
  const isLengthWithinLimit = element.textContent.length <= maxLength;
  element.remove();

  return isLengthWithinLimit;
};

export const decodeHtmlEntities = text => {
  if (isNotPresent(text)) return text;

  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  const decodedText = textArea.value;
  textArea.remove();

  return decodedText;
};
