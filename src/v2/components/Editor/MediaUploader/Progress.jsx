import { Button, Tooltip, Typography } from "@bigbinary/neeto-atoms";
import { X } from "lucide-react";
import { withT } from "neetocommons/react-utils";

import FileIcon from "src/v2/components/Common/FileIcon";

const Progress = withT(({ t, queuedFiles, cancelUpload }) => (
  <div className="ne-media-uploader__wrapper">
    {queuedFiles.map(({ id, filename, progress = 0 }) => (
      <div className="ne-media-uploader__media" key={id}>
        <div className="ne-media-uploader__media__cancel-button-wrapper">
          <Button
            data-testid="neeto-editor-image-upload-cancel-button"
            icon={X}
            size="sm"
            variant="ghost"
            onClick={() => cancelUpload(id)}
          />
        </div>
        <FileIcon
          className="ne-media-uploader__media__info__icon"
          fileName={filename}
        />
        <div className="ne-media-uploader__media__info">
          <Typography variant="body3">
            {progress === 100 && t("neetoEditor.localUploader.completed")}
            {progress !== 100 && <>{progress}%</>}
          </Typography>
          <div className="ne-media-uploader__media__progress">
            <div
              className="ne-media-uploader__media__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Tooltip content={filename} position="top">
            <Typography variant="body3">{filename}</Typography>
          </Tooltip>
        </div>
      </div>
    ))}
  </div>
));

export default Progress;
