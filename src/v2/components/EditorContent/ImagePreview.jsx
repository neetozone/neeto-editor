import { useEffect, useRef, useState } from "react";

import { Button, Spinner } from "@bigbinary/neeto-atoms";
import classnames from "classnames";
import { X } from "lucide-react";
import { useOnClickOutside } from "neetocommons/react-utils";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const ImagePreview = ({ imagePreviewDetails, setImagePreviewDetails }) => {
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();

  const imagePreviewRef = useRef(null);

  useOnClickOutside(imagePreviewRef, () => setImagePreviewDetails(null), {
    enabled: true,
  });

  useEffect(() => {
    if (!imagePreviewRef.current) return;

    imagePreviewRef.current.setAttribute("tabindex", "-1");
    imagePreviewRef.current.focus();
  }, []);

  const handleKeyDown = e => {
    e.stopPropagation();
    e.key === "Escape" && setImagePreviewDetails(null);
  };

  return createPortal(
    <div className="ne-image-preview-wrapper active">
      {isLoading && <Spinner className="ne-image-preview-wrapper__spinner" />}
      {!isLoading && (
        <div className="close-button">
          <Button
            icon={X}
            variant="secondary"
            onClick={() => setImagePreviewDetails(null)}
          />
        </div>
      )}
      <div
        className={classnames("ne-image-preview", {
          "image-loaded": !isLoading,
        })}
      >
        <img
          alt={t("neetoEditor.editorContent.imagePreviewAltText")}
          ref={imagePreviewRef}
          src={imagePreviewDetails.src}
          onKeyDown={handleKeyDown}
          onLoad={() => setIsLoading(false)}
        />
        {imagePreviewDetails && (
          <p className="ne-image-preview__caption">
            {imagePreviewDetails.caption}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ImagePreview;
