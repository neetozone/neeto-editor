import { URL_VALIDATORS } from "common/constants";

import { DEFAULT_EMBED_DIMENSIONS } from "./constants";
import { detectAspectRatio } from "./detectAspectRatio";

const findPlaceholderEmbed = (doc, src) => {
  let foundPos = null;
  let foundNode = null;

  doc.descendants((node, pos) => {
    if (foundPos !== null) return false;

    if (node.type.name !== "unified-video") return undefined;

    if (node.attrs.src !== src) return undefined;

    if (node.attrs.aspectRatio !== "auto") return undefined;

    if (node.attrs.figwidth !== DEFAULT_EMBED_DIMENSIONS.width) {
      return undefined;
    }

    if (node.attrs.figheight !== DEFAULT_EMBED_DIMENSIONS.height) {
      return undefined;
    }

    foundPos = pos;
    foundNode = node;

    return false;
  });

  return foundNode === null ? null : { pos: foundPos, node: foundNode };
};

const validateUrl = url => {
  if (!url) return false;

  for (const validator of Object.values(URL_VALIDATORS)) {
    const result = validator(url);
    if (result) return result;
  }

  return false;
};

// Inserts run synchronously at default placeholder dimensions; this resolves the
// real aspect from oEmbed (or fallback) and patches the matching placeholder node
// in-place. Searches by `src` + placeholder attrs rather than a fixed position so
// the update is robust against the user typing or inserting content during the
// network round-trip, and skips the update entirely if the user already adjusted
// the embed (so we never clobber their changes).
const updateEmbedWithDetectedDimensions = async ({
  editor,
  originalUrl,
  validatedSrc,
}) => {
  if (!editor) return;

  const { width, height } = await detectAspectRatio(originalUrl);
  if (editor.isDestroyed) return;

  const found = findPlaceholderEmbed(editor.state.doc, validatedSrc);
  if (!found) return;

  editor.view.dispatch(
    editor.state.tr.setNodeMarkup(found.pos, undefined, {
      ...found.node.attrs,
      figwidth: width,
      figheight: height,
      originalFigwidth: width,
      originalFigheight: height,
    })
  );
};

export { validateUrl, updateEmbedWithDetectedDimensions };
