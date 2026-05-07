import { useRef } from "react";

import { Typography } from "@bigbinary/neeto-atoms";
import { ImageUp } from "lucide-react";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";

import useDropFiles from "hooks/useDropFiles";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  DEFAULT_IMAGE_UPLOAD_CONFIG,
  DEFAULT_VIDEO_UPLOAD_CONFIG,
} from "src/v2/components/Editor/MediaUploader/constants";
import { convertToFileSize } from "src/v2/components/Editor/MediaUploader/utils";
import useFileUploader from "src/v2/hooks/useFileUploader";

import Progress from "./Progress";

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
      <ImageUp className="ne-media-uploader__dnd-icon" size={24} />
      <Typography variant="body2">
        {t("neetoEditor.localUploader.dropFilesHere")}
      </Typography>
      <Typography variant="body3">
        {t("neetoEditor.localUploader.maxFileSize", {
          entity: convertToFileSize(uploadConfig.restrictions.maxFileSize),
        })}
      </Typography>
    </div>
  );
};

export default LocalUploader;
