import { useEffect, useState } from "react";

import { ALL_PROTOCOL_URL_REGEXP } from "common/constants";
import { isNotPresent } from "neetocist";
import { Close } from "neetoicons";
import { Button } from "neetoui";
import { useTranslation } from "react-i18next";

import { validateAndFormatUrl } from "components/Editor/utils";

const LinkOption = ({ editor, handleClose, handleAnimateInvalidLink }) => {
  const { t } = useTranslation();

  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(editor.getAttributes("link").href || "");
  }, [editor]);

  const handleKeyDown = event => {
    if (event.key === "Escape") {
      handleClose();
    } else if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (ALL_PROTOCOL_URL_REGEXP.test(link)) {
      editor.chain().focus().setLink({ href: link }).run();
      handleClose();
    } else if (isNotPresent(link)) {
      editor.chain().focus().unsetLink().run();
      handleClose();
    } else {
      setLink("");
      handleAnimateInvalidLink();
    }
  };

  const handleReset = () => {
    if (link) {
      setLink("");
      editor.chain().focus().unsetLink().run();
    } else {
      handleClose();
    }
  };

  return (
    <div className="neeto-editor-bubble-menu__link" onKeyDown={handleKeyDown}>
      <input
        autoFocus
        className="neeto-editor-bubble-menu-link__input"
        data-cy="neeto-editor-link-input"
        name="url"
        placeholder={t("neetoEditor.placeholders.linkInput")}
        value={link}
        onChange={({ target: { value } }) =>
          setLink(validateAndFormatUrl(value))
        }
      />
      <Button
        data-cy="neeto-editor-link-cancel-button"
        icon={Close}
        size="small"
        style="secondary"
        onClick={handleReset}
      />
    </div>
  );
};

export default LinkOption;
