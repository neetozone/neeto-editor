// eslint-disable-next-line @bigbinary/neeto/use-snake-case-for-api-connector-filename
import { useRef } from "react";

// eslint-disable-next-line @bigbinary/neeto/no-axios-import-outside-apis,
import axios from "axios";
import { noop, hyphenate, isNot, isNotPresent } from "neetocist";
import { Toastr } from "neetoui";
import { omit, pluck } from "ramda";
import { useTranslation } from "react-i18next";

import useFileUploadStore from "src/stores/useFileUploadStore";
import DirectUpload from "utils/DirectUpload";

import { FILE_UPLOAD_STATUS } from "./constants/fileUploader";
import { getRandomString } from "./utils";
import { selectFiles } from "./utils/fileUploader";

let uploadControllers = {};

const useFileUploader = ({
  config,
  attachments: previousAttachments = [],
  setIsUploadingOnHost = noop,
}) => {
  const contextIdRef = useRef(getRandomString());
  const { t } = useTranslation();

  const { current: contextId } = contextIdRef;
  const {
    addFiles: addFilesToStore,
    getNextQueuedFile,
    updateFileStatus,
    removeFilesFromQueue,
    setIsUploading,
    updateFileUploadProgress,
    removeFile,
  } = useFileUploadStore.pick();
  const { files = [], isUploading } = useFileUploadStore.pick([contextId]);

  const handleUploadProgress = (xhr, file) => {
    if (!xhr.event.lengthComputable) return;
    const bytesUploaded = xhr.loaded;
    const bytesTotal = xhr.total;
    const progress = Math.round((bytesUploaded / bytesTotal) * 100);
    updateFileUploadProgress(contextId, file.id, progress);
  };

  const uploadFile = async file => {
    const upload = new DirectUpload({
      file: file.data,
      url: config.directUploadEndpoint,
      progress: xhr => handleUploadProgress(xhr, file),
    });

    uploadControllers[file.id] = upload;

    try {
      const { data = {}, ...response } = await upload.create();
      updateFileStatus(contextId, file.id, FILE_UPLOAD_STATUS.UPLOADED);

      return {
        id: file.id,
        filename: file.filename,
        signedId: data.signed_id ?? response.signed_id,
        url: data.blob_url ?? response.blob_url,
        contentType: data.content_type ?? response.content_type,
      };
    } catch (error) {
      if (!axios.isCancel(error)) {
        Toastr.error(t("neetoEditor.error.uploadFileFailed"));
      }
      // eslint-disable-next-line no-console
      console.error("Attachment upload failed", error);
      removeFile(contextId, file.id);

      return null;
    }
  };

  const handleUploadFiles = async () => {
    const queuedFile = getNextQueuedFile(contextId);

    if (isNotPresent(queuedFile)) {
      setIsUploading(contextId, false);
      setIsUploadingOnHost(false);

      return [];
    }

    updateFileStatus(contextId, queuedFile.id, FILE_UPLOAD_STATUS.UPLOADING);

    const [uploadedFile, remainingUploadedFiles] = await Promise.all([
      uploadFile(queuedFile),
      handleUploadFiles(),
    ]);

    const uploadedFiles = [uploadedFile, ...remainingUploadedFiles];
    const uploadedFileIds = pluck("id", uploadedFiles);
    removeFilesFromQueue(contextId, uploadedFileIds);
    uploadControllers = omit(uploadedFileIds, uploadControllers);

    return uploadedFiles.filter(isNot(null));
  };

  const uploadFiles = () => {
    setIsUploading(contextId, true);
    setIsUploadingOnHost(true);

    return handleUploadFiles();
  };

  const addFiles = addedFiles => {
    const selectedFiles = selectFiles({
      previousAttachmentsCount: previousAttachments.length,
      config,
      files: Array.from(addedFiles),
    }).map(file => ({
      id: hyphenate(`${file.name.toLowerCase()}-${Date.now()}`),
      data: file,
      filename: file.name,
      signedId: "awaiting",
      url: "",
      type: file.type,
      status: FILE_UPLOAD_STATUS.QUEUED,
    }));

    addFilesToStore(contextId, selectedFiles);
  };

  const cancelUpload = fileId => {
    uploadControllers[fileId]?.abort?.();
    removeFile(contextId, fileId);
  };

  return {
    addFiles,
    uploadFiles,
    queuedFiles: files,
    cancelUpload,
    isUploading,
  };
};

export default useFileUploader;
