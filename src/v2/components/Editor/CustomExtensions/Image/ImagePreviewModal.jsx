import { useState } from "react";

import { Button, Dialog, Spinner } from "@bigbinary/neeto-atoms";
import classNames from "classnames";
import { X } from "lucide-react";
import { isPresent } from "neetocist";
import { isNil } from "ramda";

const ImagePreviewModal = ({ previewUrl, setPreviewUrl }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => setIsLoading(false);

  const handleClose = () => {
    setIsLoading(true);
    setPreviewUrl(null);
  };

  return (
    <Dialog
      className="image-preview-neeto-ui-modal"
      closeButton={false}
      isOpen={isPresent(previewUrl)}
      size="fullScreen"
      onClose={handleClose}
    >
      <>
        {isLoading || isNil(previewUrl) ? (
          <div className="spinner-wrapper">
            <Spinner className="spinner" />
          </div>
        ) : (
          <Button
            className="image-preview-neeto-ui-modal__close-btn"
            icon={X}
            variant="secondary"
            onClick={handleClose}
            onKeyDown={e => e.key === "Escape" && handleClose}
          />
        )}
        <img
          alt="Preview"
          src={previewUrl}
          className={classNames({
            "display-none": isLoading || isNil(previewUrl),
          })}
          onLoad={handleImageLoad}
        />
      </>
    </Dialog>
  );
};

export default ImagePreviewModal;
