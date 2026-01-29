import { Toastr } from "neetoui";
import { mergeRight } from "ramda";

import { DEFAULT_FILE_UPLOAD_CONFIG } from "./constants";

export const buildFileUploadConfig = config =>
  mergeRight(DEFAULT_FILE_UPLOAD_CONFIG, config);

export const downloadFile = async (fileUrl, filename) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.setAttribute("download", filename);
    a.style.display = "none";
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    Toastr.error(error);
  }
};

export const checkPreviewAvailability = contentType =>
  contentType &&
  (contentType.startsWith("video/") ||
    contentType === "application/pdf" ||
    contentType === "image/jpeg" ||
    contentType === "image/gif" ||
    contentType === "image/png" ||
    contentType === "image/webp" ||
    contentType === "text/plain" ||
    contentType === "image/bmp" ||
    contentType === "application/msword" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    contentType === "image/jpg" ||
    contentType === "application/vnd.ms-powerpoint" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    contentType === "image/tiff" ||
    contentType === "application/vnd.ms-excel" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
