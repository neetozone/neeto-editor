import { t } from "i18next";
import { globalProps } from "neetocommons/initializers";
import * as yup from "yup";

import { DIRECT_UPLOAD_ENDPOINT } from "src/common/constants";

import { validateUrl } from "../CustomExtensions/Embeds/utils";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

export const FILE_SIZE_UNITS = ["B", "KB", "MB", "GB"];

export const ALLOWED_IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".gif"];
export const ALLOWED_VIDEO_TYPES = [".mp4", ".mov", ".avi", ".mkv"];

export const DEFAULT_IMAGE_UPLOAD_CONFIG = {
  directUploadEndpoint: DIRECT_UPLOAD_ENDPOINT,
  restrictions: {
    maxNumberOfFiles: 5,
    maxFileSize: globalProps.endUserUploadedFileSizeLimitInMb * 1024 * 1024,
    allowedFileTypes: ALLOWED_IMAGE_TYPES,
  },
};

export const DEFAULT_VIDEO_UPLOAD_CONFIG = {
  directUploadEndpoint: DIRECT_UPLOAD_ENDPOINT,
  restrictions: {
    maxNumberOfFiles: 5,
    maxFileSize: MAX_VIDEO_SIZE,
    allowedFileTypes: ALLOWED_VIDEO_TYPES,
  },
};

export const VIDEO_EMBED_FORM_VALIDATION_SCHEMA = yup.object().shape({
  videoUrl: yup
    .string()
    .required(t("neetoEditor.error.fieldRequired"))
    .test(
      "is-valid-video-url",
      t("neetoEditor.error.invalidEmbedUrl"),
      validateUrl
    ),
});
