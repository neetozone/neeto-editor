import { globalProps } from "neetocommons/initializers";

import { DIRECT_UPLOAD_ENDPOINT } from "src/common/constants";

export const DEFAULT_FILE_UPLOAD_CONFIG = {
  directUploadEndpoint: DIRECT_UPLOAD_ENDPOINT,
  restrictions: {
    maxFileSize: globalProps.endUserUploadedFileSizeLimitInMb * 1024 * 1024,
  },
};

export const ATTACHMENT_OPTIONS = {
  OPEN_IN_NEW_TAB: "neetoEditor.common.openInNewTab",
  DOWNLOAD: "neetoEditor.common.download",
  RENAME: "neetoEditor.attachments.rename",
  DELETE: "neetoEditor.menu.delete",
};

export const ATTACHMENTS_PREVIEW_DATA_CY = "ne-attachments-preview-content";
