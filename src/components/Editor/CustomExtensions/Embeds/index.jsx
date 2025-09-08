import { useRef, useState } from "react";

import { withEventTargetValue } from "neetocommons/utils";
import { Button, Input, Modal, Typography } from "neetoui";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";

import { URL_REGEXP } from "src/common/constants";

import { validateUrl } from "./utils";

const EmbedOption = ({ isEmbedModalOpen, setIsEmbedModalOpen, editor }) => {
  const { t } = useTranslation();

  const [embedUrl, setEmbedUrl] = useState("");
  const [error, setError] = useState(false);

  const inputRef = useRef(null);

  const handleEmbed = () => {
    const match = embedUrl.match(URL_REGEXP);
    const validatedUrl = match ? match[0] : null;

    if (validatedUrl) {
      editor
        .chain()
        .focus()
        .setExternalVideo({ src: validatedUrl })
        .command(({ tr, commands }) => {
          const { doc, selection } = tr;
          const position = doc.resolve(selection.to).end();

          return commands.insertContentAt(position, { type: "paragraph" });
        })
        .run();
      setEmbedUrl("");
      setIsEmbedModalOpen(false);
    } else {
      setError(true);
    }
  };

  const handleChange = url => {
    if (validateUrl(url)) {
      setError(false);
      setEmbedUrl(url);
    } else {
      setError(true);
      setEmbedUrl(url);
    }
  };

  const handleClose = () => {
    setEmbedUrl("");
    setError(false);
    setIsEmbedModalOpen(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      handleEmbed();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <Modal
      className="ne-embed-modal-wrapper"
      initialFocusRef={inputRef}
      isOpen={isEmbedModalOpen}
      onClose={handleClose}
    >
      <Modal.Header>
        <Typography style="h2">{t("neetoEditor.menu.embedVideo")}</Typography>
      </Modal.Header>
      <Modal.Body className="ne-embed-modal space-y-2">
        <Input
          data-cy="neeto-editor-embed-input"
          error={error && t("neetoEditor.error.invalidEmbedUrl")}
          label={t("neetoEditor.common.videoUrl")}
          ref={inputRef}
          size="medium"
          type="text"
          value={embedUrl}
          onChange={withEventTargetValue(handleChange)}
          onKeyDown={handleKeyDown}
        />
      </Modal.Body>
      <Modal.Footer className="space-x-2">
        <Button
          data-cy="neeto-editor-embed-cancel"
          disabled={error || isEmpty(embedUrl)}
          label={t("neetoEditor.common.embed")}
          onClick={handleEmbed}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default EmbedOption;
