import {
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
  lazy,
  Suspense,
  useMemo,
  memo,
} from "react";

import classnames from "classnames";
import { isNotEmpty, isPresent, noop } from "neetocist";
import { Button, Toastr } from "neetoui";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";

import useDropFiles from "hooks/useDropFiles";
import useFileUploader from "hooks/useFileUploader";
import "src/styles/components/attachments.scss";

import Attachment from "./Attachment";
import AttachmentProgress from "./AttachmentProgress";
import { buildFileUploadConfig } from "./utils";

const Preview = lazy(() => import("./Preview"));

const Attachments = (
  {
    attachments = [],
    className = "",
    onChange = noop,
    isIndependent = true,
    disabled = false,
    dragDropRef = null,
    config = {},
    setIsUploading = noop,
    allowDelete = true,
    allowOpenInNewTab = false,
  },
  ref
) => {
  const { t } = useTranslation();

  const [selectedAttachment, setSelectedAttachment] = useState({});
  const [didFetchPreviewBundle, setDidFetchPreviewBundle] = useState(false);

  const attachmentInputRef = useRef(null);

  const fileUploadConfig = useMemo(
    () => buildFileUploadConfig(config),
    [config]
  );

  const { addFiles, uploadFiles, queuedFiles, cancelUpload, isUploading } =
    useFileUploader({
      config: fileUploadConfig,
      setIsUploadingOnHost: setIsUploading,
      attachments,
    });

  const handleAddFile = async event => {
    addFiles(event.target.files);
    const uploadedFiles = await uploadFiles();
    isNotEmpty(uploadedFiles) && onChange([...attachments, ...uploadedFiles]);
    attachmentInputRef.current.value = null;
  };

  const handleUploadAttachments = () => attachmentInputRef.current.click();

  const handleFileInputClick = event => {
    if (!(!isEmpty(attachments) && fileUploadConfig.maxNumberOfFiles === 1)) {
      return;
    }
    event.preventDefault();
    Toastr.warning(t("neetoEditor.attachments.oneAttachmentAllowed"));
  };

  useImperativeHandle(ref, () => ({ handleUploadAttachments }), []);

  const handleFilesDrop = async files => {
    addFiles(files);
    const uploadedFiles = await uploadFiles();
    isNotEmpty(uploadedFiles) && onChange([...attachments, ...uploadedFiles]);
  };

  useDropFiles({
    dropTargetRef: dragDropRef,
    attachments,
    onDrop: handleFilesDrop,
  });

  return (
    <div className={classnames("ne-attachments", { [className]: className })}>
      <div className="ne-attachments__items">
        {attachments.map(attachment => (
          <Attachment
            {...{
              allowDelete,
              allowOpenInNewTab,
              attachment,
              attachments,
              disabled,
              onChange,
              setSelectedAttachment,
            }}
            key={attachment.signedId}
            isLoading={
              !didFetchPreviewBundle &&
              selectedAttachment.url === attachment.url
            }
          />
        ))}
        {queuedFiles.map(attachment => (
          <AttachmentProgress
            {...{ attachment, cancelUpload }}
            key={attachment.id}
          />
        ))}
      </div>
      <div>
        {isIndependent && (
          <Button
            data-testid="neeto-editor-attachments-upload-button"
            disabled={isUploading}
            label={t("neetoEditor.attachments.add")}
            loading={isUploading}
            size="medium"
            style="link"
            onClick={handleUploadAttachments}
          />
        )}
        <input
          accept={fileUploadConfig.allowedFileTypes?.join(",")}
          multiple={fileUploadConfig.maxNumberOfFiles !== 1}
          ref={attachmentInputRef}
          type="file"
          onChange={handleAddFile}
          onClick={handleFileInputClick}
        />
        <Suspense fallback={<span />}>
          {isPresent(selectedAttachment) && (
            <Preview
              {...{
                attachments,
                selectedAttachment,
                setDidFetchPreviewBundle,
                setSelectedAttachment,
              }}
              onClose={() => setSelectedAttachment({})}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

Attachments.displayName = "NeetoEditorAttachments";

export default memo(forwardRef(Attachments));
