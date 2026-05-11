import { IMAGE_PLACEHOLDER } from "./constants";

export const updateAttributes = (attrs, editor, getPos) => {
  if (typeof getPos === "function") {
    editor
      .chain()
      .focus()
      .setNodeSelection(getPos())
      .updateAttributes("image", attrs)
      .run();
  }
};

export const deleteNode = (editor, getPos, node) => {
  if (typeof getPos === "function") {
    editor
      .chain()
      .focus()
      .deleteRange({ from: getPos(), to: getPos() + node.nodeSize })
      .run();
  }
};

export const handleImageLoad = ({ figwidth, image, dom }) => {
  const aspectRatio = image.height / image.width;
  const height = parseInt(figwidth * aspectRatio);
  dom.style.minWidth = `${figwidth}px`;
  dom.style.minHeight = `${height}px`;
};

export const fetchImage = ({ src, onImageLoad }) => {
  const image = new Image();
  image.src = src;
  image.onload = onImageLoad;
};

export const createImageContainerDom = ({ figwidth, figheight = 100 }) => {
  const dom = document.createElement("div");
  dom.style.minWidth = `${figwidth}px`;
  dom.style.minHeight = `${figheight}px`;
  dom.classList.add("image-component-node-view");

  return dom;
};

export const appendImageContainerToDom = ({ dom, reactRenderer }) => {
  dom.innerHTML = "";
  dom.appendChild(reactRenderer.element);
};

export const destroyReactComponent = ({ reactRenderer, dom }) => {
  if (!reactRenderer) return;
  reactRenderer.destroy();
  dom.appendChild(IMAGE_PLACEHOLDER);
};
