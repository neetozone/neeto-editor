export const IMAGE_PREVIEW_CONTAINER_TEMPLATE = `
  <div class="close-button">
    <button id="neImagePreviewCloseButton">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path fill="none" d="M0 0h24v24H0z"></path><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
      </svg>
    </button>
  </div>
  <!-- append the IMAGE_PREVIEW_CONTENT_TEMPLATE here -->
`;

export const IMAGE_PREVIEW_CONTENT_TEMPLATE = `
  <div class="ne-image-preview" id="neImagePreviewContentContainer">
    <img
      alt="{{imageCaption}}"
      src="{{imageSource}}"
    />
    <p class="ne-image-preview__caption">
      {{imageCaption}}
    </p>
  </div>
`;

export const IMG_TAGS = ["FIGURE", "IMG"];
