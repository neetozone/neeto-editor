import { IMAGE_PREVIEW_CONTENT_TEMPLATE } from "../constants/editorUtils";

export const getImageDetails = event => {
  const imageElement = event.target.querySelector("IMG");
  const captionElement = event.target.querySelector("FIGCAPTION");
  const imageUrl = imageElement.getAttribute("src");
  const caption = captionElement.textContent?.trim?.();

  return { imageUrl, caption };
};

export const getPreviewHtml = (imageUrl, caption) =>
  IMAGE_PREVIEW_CONTENT_TEMPLATE.replaceAll(
    "{{imageCaption}}",
    caption
  ).replace("{{imageSource}}", imageUrl);
