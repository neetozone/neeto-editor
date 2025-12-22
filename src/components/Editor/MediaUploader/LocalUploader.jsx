import { useRef } from "react";

import { ImageUpload } from "neetoicons";
import { Typography } from "neetoui";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";

import useDropFiles from "hooks/useDropFiles";
import useFileUploader from "hooks/useFileUploader";

import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  DEFAULT_IMAGE_UPLOAD_CONFIG,
  DEFAULT_VIDEO_UPLOAD_CONFIG,
} from "./constants";
import Progress from "./Progress";
import { convertToFileSize } from "./utils";

const LocalUploader = ({
  isImage,
  onClose,
  insertMediaToEditor,
  setIsUploading,
}) => {
  const { t } = useTranslation();

  const uploadConfig = isImage
    ? DEFAULT_IMAGE_UPLOAD_CONFIG
    : DEFAULT_VIDEO_UPLOAD_CONFIG;

  const fileInputRef = useRef(null);
  const dropTargetRef = useRef(null);

  const { addFiles, uploadFiles, queuedFiles, cancelUpload, isUploading } =
    useFileUploader({
      config: uploadConfig,
      setIsUploadingOnHost: setIsUploading,
    });

  const handleFilesDrop = async files => {
    addFiles(files);
    const uploadedFiles = await uploadFiles();
    uploadedFiles.forEach(insertMediaToEditor);
    onClose();
  };

  useDropFiles({ dropTargetRef, onDrop: handleFilesDrop });

  setIsUploading(isUploading);

  const handleAddFile = async ({ target: { files } }) => {
    addFiles(files);
    const uploadedFiles = await uploadFiles();
    uploadedFiles.forEach(insertMediaToEditor);
    onClose();
  };

  return !isEmpty(queuedFiles) || isUploading ? (
    <Progress {...{ cancelUpload, queuedFiles }} />
  ) : (
    <div
      className="ne-media-uploader__dnd"
      data-testid="neeto-editor-media-uploader-dnd"
      ref={dropTargetRef}
      tabIndex={0}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        multiple
        className="ne-media-uploader__dnd-input"
        data-testid="neeto-editor-media-uploader-input"
        ref={fileInputRef}
        type="file"
        accept={
          isImage
            ? ALLOWED_IMAGE_TYPES.join(",")
            : ALLOWED_VIDEO_TYPES.join(",")
        }
        onChange={handleAddFile}
      />
      <ImageUpload className="ne-media-uploader__dnd-icon" size={24} />
      <Typography style="body2">
        {t("neetoEditor.localUploader.dropFilesHere")}
      </Typography>
      <Typography style="body3">
        {t("neetoEditor.localUploader.maxFileSize", {
          entity: convertToFileSize(uploadConfig.restrictions.maxFileSize),
        })}
      </Typography>
    </div>
  );
};

export default LocalUploader;
