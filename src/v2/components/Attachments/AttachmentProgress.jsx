import { Button, Typography } from "@bigbinary/neeto-atoms";
import { X } from "lucide-react";
import { FileIcon } from "react-file-icon";

const AttachmentProgress = ({ attachment, cancelUpload }) => {
  const progressPercentage = `${attachment.progress ?? 0}%`;

  const handleCancel = () => {
    cancelUpload(attachment.id);
  };

  return (
    <div className="ne-attachments__preview">
      <div className="ne-attachments__preview__progress-icon">
        <FileIcon />
      </div>
      <div className="ne-attachments__preview__progress">
        <Typography variant="body2">{attachment.filename}</Typography>
        <Typography variant="body2">{progressPercentage}</Typography>
      </div>
      <Button
        data-testid="neeto-editor-preview-upload-cancel-button"
        icon={X}
        size="sm"
        variant="ghost"
        onClick={handleCancel}
      />
    </div>
  );
};

export default AttachmentProgress;
