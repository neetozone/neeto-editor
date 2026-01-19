import { t } from "i18next";
import { globalProps } from "neetocommons/initializers";

import { DIRECT_UPLOAD_ENDPOINT } from "src/common/constants";

export const DEFAULT_FILE_UPLOAD_CONFIG = {
  directUploadEndpoint: DIRECT_UPLOAD_ENDPOINT,
  restrictions: {
    maxFileSize: globalProps.endUserUploadedFileSizeLimitInMb * 1024 * 1024,
  },
};

export const ATTACHMENT_OPTIONS = {
  OPEN_IN_NEW_TAB: t("neetoEditor.common.openInNewTab"),
  DOWNLOAD: t("neetoEditor.common.download"),
  RENAME: t("neetoEditor.attachments.rename"),
  DELETE: t("neetoEditor.menu.delete"),
};

export const ATTACHMENTS_PREVIEW_DATA_CY = "ne-attachments-preview-content";
