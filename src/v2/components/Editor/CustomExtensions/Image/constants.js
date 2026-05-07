import "src/styles/editor/_image-skeleton.scss";

const imageSkeletonContainer = document.createElement("div");
imageSkeletonContainer.classList.add("neeto-editor-image__skeleton");

const imageSkeleton = document.createElement("div");
imageSkeleton.classList.add("skeleton");

imageSkeletonContainer.appendChild(imageSkeleton);

export const IMAGE_PLACEHOLDER = imageSkeletonContainer;

export const LARGE_IMAGE_ERROR = "IMAGE_SIZE_LARGER";
