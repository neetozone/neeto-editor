import { useEffect, useRef } from "react";

import { Button, Dialog, Typography } from "@bigbinary/neeto-atoms";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { findIndexBy, truncate } from "neetocist";
import { isEmpty } from "ramda";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { Trans, useTranslation } from "react-i18next";

import { convertToFileSize } from "src/v2/components/Editor/MediaUploader/utils";

import { ATTACHMENTS_PREVIEW_DATA_CY } from "./constants";
import { checkPreviewAvailability, downloadFile } from "./utils";

const Preview = ({
  onClose,
  attachments,
  selectedAttachment,
  setSelectedAttachment,
  setDidFetchPreviewBundle,
}) => {
  const { t } = useTranslation();
  const downloadRef = useRef(null);

  const {
    filename = "",
    contentType = null,
    url = "",
    signedId = "",
    size = undefined,
  } = selectedAttachment;

  const attachmentIndex = findIndexBy({ signedId }, attachments);

  const handleRightArrowClick = () => {
    const newIndex = (attachmentIndex + 1) % attachments.length;
    setSelectedAttachment(attachments[newIndex]);
    downloadRef.current?.focus();
  };

  const handleLeftArrowClick = () => {
    const newIndex =
      (attachmentIndex - 1 + attachments.length) % attachments.length;
    setSelectedAttachment(attachments[newIndex]);
    downloadRef.current?.focus();
  };

  const handleKeyDown = event => {
    if (event.key === "ArrowRight") {
      handleRightArrowClick();
    } else if (event.key === "ArrowLeft") {
      handleLeftArrowClick();
    }
  };

  useEffect(() => {
    setDidFetchPreviewBundle(true);
  }, []);

  const handleDownload = () => downloadFile(url, filename);

  const setPreview = () => {
    const isPreviewAvailable = checkPreviewAvailability(contentType);

    if (isPreviewAvailable) {
      switch (contentType.split("/")[0]) {
        case "image":
          return <img data-testid={ATTACHMENTS_PREVIEW_DATA_CY} src={url} />;
        case "video":
          return (
            <video
              controls
              data-testid={ATTACHMENTS_PREVIEW_DATA_CY}
              src={url}
            />
          );
        case "application":
        case "text":
          if (contentType === "application/pdf") {
            return (
              <iframe
                data-testid={ATTACHMENTS_PREVIEW_DATA_CY}
                src={url}
                width="100%"
              />
            );
          }

          return (
            <DocViewer
              className="ne-attachments-preview__body-docviewer"
              data-testid={ATTACHMENTS_PREVIEW_DATA_CY}
              documents={[{ uri: url, fileType: contentType }]}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: { disableHeader: true, disableFileName: true },
              }}
            />
          );
        default:
          return null;
      }
    }

    return (
      <Typography>
        <Trans
          i18nKey="neetoEditor.attachments.noPreview"
          components={{
            span: (
              <span
                className="ne-attachments-preview__body-download"
                onClick={handleDownload}
              />
            ),
          }}
        />
      </Typography>
    );
  };

  return (
    <Dialog
      {...{ onClose }}
      className="ne-attachments-preview"
      isOpen={!isEmpty(selectedAttachment)}
      size="fullScreen"
      onKeyDown={handleKeyDown}
    >
      <Dialog.Header className="ne-attachments-preview__header">
        <div className="ne-attachments-preview__header__fileinfo">
          <Dialog.Title>
            <Typography variant="h4">{truncate(filename, 25)}</Typography>
          </Dialog.Title>
          <Typography variant="body2">{convertToFileSize(size)}</Typography>
        </div>
        <Button
          label={t("neetoEditor.common.download")}
          ref={downloadRef}
          variant="link"
          onClick={handleDownload}
        />
      </Dialog.Header>
      <Dialog.Body className="ne-attachments-preview__body">
        <Button
          className="ne-attachments-preview__body-left"
          icon={ChevronLeft}
          size="lg"
          variant="ghost"
          onClick={handleLeftArrowClick}
        />
        <Button
          className="ne-attachments-preview__body-right"
          icon={ChevronRight}
          size="lg"
          variant="ghost"
          onClick={handleRightArrowClick}
        />
        {setPreview()}
      </Dialog.Body>
    </Dialog>
  );
};

export default Preview;
