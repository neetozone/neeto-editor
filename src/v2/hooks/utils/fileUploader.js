import { Toastr } from "@bigbinary/neeto-atoms";
import { t } from "i18next";
import { isPresent } from "neetocist";
import { mergeRight } from "ramda";

import { DEFAULT_FILE_UPLOAD_CONFIG } from "src/v2/components/Attachments/constants";
import { convertToFileSize } from "src/v2/components/Editor/MediaUploader/utils";

const getFileExtension = filename => {
  if (!filename) return "";
  const parts = filename.split(".");

  return parts.length > 1 ? `.${parts.pop()}` : "";
};

const showWarningToastr = ({
  selectedFiles,
  initialFiles,
  config,
  largeFilesCount,
  unSupportedFilesCount,
}) => {
  const { maxNumberOfFiles, maxFileSize } = config.restrictions;

  if (unSupportedFilesCount > 0 || largeFilesCount > 0) {
    if (unSupportedFilesCount > 0) {
      Toastr.error(t("neetoEditor.error.fileNotAllowed"));
    }

    if (largeFilesCount > 0) {
      Toastr.error(
        t("neetoEditor.error.fileIsTooLarge", {
          maxFileSize: convertToFileSize(maxFileSize),
        })
      );
    }
  } else if (selectedFiles.length < initialFiles.length) {
    Toastr.warning(
      t("neetoEditor.attachments.maxNumberOfFiles", {
        entity: maxNumberOfFiles,
      })
    );
  }
};

export const buildFileUploadConfig = config =>
  mergeRight(DEFAULT_FILE_UPLOAD_CONFIG, config);

export const shouldAddFile = config => file => {
  const { maxFileSize, allowedFileTypes } = config.restrictions;

  if (isPresent(maxFileSize) && file.size > maxFileSize) {
    return { canAdd: false };
  }

  if (isPresent(allowedFileTypes)) {
    const fileExtension = getFileExtension(file.name);
    const mimeType = file.type;

    const extensionAllowed = allowedFileTypes.includes(fileExtension);
    const mimeAllowed = allowedFileTypes.includes(mimeType);

    const canAdd = extensionAllowed || mimeAllowed;

    return { canAdd, isUnsupportedFile: !canAdd };
  }

  return { canAdd: true };
};

export const selectFiles = ({ previousAttachmentsCount, config, files }) => {
  let addedFilesCount = 0,
    largeFilesCount = 0,
    unSupportedFilesCount = 0;
  const fallbackMaxNumberOfFiles = previousAttachmentsCount + files.length;
  const { maxNumberOfFiles = fallbackMaxNumberOfFiles } = config.restrictions;
  const canAddFile = shouldAddFile(config);

  const remainingAttachments = maxNumberOfFiles - previousAttachmentsCount;

  if (remainingAttachments <= 0) {
    Toastr.warning(
      t("neetoEditor.attachments.maxNumberOfFiles", {
        entity: maxNumberOfFiles,
      })
    );

    return [];
  }

  const selectedFiles = files.filter(file => {
    const { canAdd, isUnsupportedFile } = canAddFile(file);

    if (canAdd && addedFilesCount + 1 <= remainingAttachments) {
      addedFilesCount += 1;

      return true;
    }

    if (isUnsupportedFile) unSupportedFilesCount += 1;
    else if (!canAdd) largeFilesCount += 1;

    return false;
  });

  showWarningToastr({
    selectedFiles,
    initialFiles: files,
    config,
    unSupportedFilesCount,
    largeFilesCount,
  });

  return selectedFiles;
};
