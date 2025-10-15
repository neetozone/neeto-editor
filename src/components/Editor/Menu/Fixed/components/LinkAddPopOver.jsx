import { useState, useEffect, useRef } from "react";

import { isNotPresent } from "neetocist";
import { useOnClickOutside } from "neetocommons/react-utils";
import { Button, Checkbox, Input } from "neetoui";
import { not } from "ramda";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { validateAndFormatUrl } from "components/Editor/utils";
import { ALL_PROTOCOL_URL_REGEXP } from "src/common/constants";

import { getLinkPopoverPosition, getCursorPos } from "../utils";

const LinkAddPopOver = ({
  isAddLinkActive,
  setIsAddLinkActive,
  editor,
  openLinkInNewTab,
}) => {
  const { from, to } = editor.state.selection;
  const text = editor.state.doc.textBetween(from, to, "");

  const [linkText, setLinkText] = useState(text);
  const [linkUrl, setLinkUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(openLinkInNewTab);
  const [error, setError] = useState("");
  const [popoverPosition, setPopoverPosition] = useState(
    getCursorPos(editor, to)
  );
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });

  const popoverRef = useRef(null);

  const { t } = useTranslation();

  const isLinkTextPresent = !isNotPresent(linkText);
  const isLinlUrlPresent = !isNotPresent(linkUrl);
  const isSubmitDisabled = !isLinkTextPresent || !isLinlUrlPresent;

  const popoverStyle = {
    display: "block",
    position: "fixed",
    top: popoverPosition.top,
    left: popoverPosition.left,
    transform: "translateY(52px) translateX(8px)",
  };

  const handleAddLink = () => {
    const { state, dispatch } = editor.view;
    const { from, to } = state.selection;
    const formattedUrl = validateAndFormatUrl(linkUrl);

    if (!ALL_PROTOCOL_URL_REGEXP.test(formattedUrl)) {
      setError(t("neetoEditor.error.invalidUrl"));

      return;
    }

    const attrs = {
      href: formattedUrl,
      target: openInNewTab ? "_blank" : "_self",
    };

    const linkMark = state.schema.marks.link.create(attrs);
    const linkTextWithMark = state.schema.text(linkText, [linkMark]);

    const tr = state.tr.replaceWith(from, to, linkTextWithMark);
    dispatch(tr);
    removePopover();
  };

  const removePopover = () => {
    editor.view.focus();
    setIsAddLinkActive(false);
  };

  const handleKeyDown = e => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLink();
    } else if (e.key === "Escape") {
      removePopover();
    }
  };

  const updatePopoverPosition = () => {
    const { arrowPosition, popoverPosition } = getLinkPopoverPosition(
      editor,
      popoverRef
    );
    setPopoverPosition(popoverPosition);
    setArrowPosition(arrowPosition);
  };

  useOnClickOutside(popoverRef, removePopover);

  useEffect(() => {
    if (editor && isAddLinkActive) {
      updatePopoverPosition();
    }
    window.addEventListener("resize", removePopover);
    window.addEventListener("wheel", removePopover);

    return () => {
      window.removeEventListener("resize", removePopover);
      window.removeEventListener("wheel", removePopover);
    };
  }, []);

  return isAddLinkActive
    ? createPortal(
        <>
          <div
            className="ne-link-arrow fade-in"
            style={{ top: arrowPosition.top, left: arrowPosition.left }}
          />
          <div
            className="ne-link-popover fade-in"
            id="ne-link-add-popover"
            ref={popoverRef}
            style={popoverStyle}
          >
            <Input
              required
              autoFocus={!isLinkTextPresent}
              data-cy="neeto-editor-add-link-text-input"
              label={t("neetoEditor.common.text")}
              placeholder={t("neetoEditor.placeholders.enterText")}
              size="small"
              style={{ width: "250px" }}
              value={linkText}
              onChange={({ target: { value } }) => setLinkText(value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              {...{ error }}
              required
              autoFocus={isLinkTextPresent}
              className="ne-link-popover__url-input"
              data-cy="neeto-editor-add-link-url-input"
              label={t("neetoEditor.common.url")}
              placeholder={t("neetoEditor.placeholders.url")}
              size="small"
              style={{ width: "250px" }}
              value={linkUrl}
              onChange={({ target: { value } }) => setLinkUrl(value)}
              onFocus={() => setError("")}
              onKeyDown={handleKeyDown}
            />
            <Checkbox
              checked={openInNewTab}
              className="ne-link-popover__checkbox"
              data-cy="neeto-editor-add-link-open-in-new-tab-switch"
              label={t("neetoEditor.common.openInNewTab")}
              onChange={() => setOpenInNewTab(not)}
            />
            <div className="ne-link-popover__edit-prompt-buttons">
              <Button
                data-cy="neeto-editor-add-link"
                disabled={isSubmitDisabled}
                label={t("neetoEditor.common.done")}
                size="small"
                onClick={handleAddLink}
              />
              <Button
                data-cy="neeto-editor-link-popover-cancel"
                label={t("neetoEditor.common.cancel")}
                size="small"
                style="text"
                onClick={removePopover}
              />
            </div>
          </div>
        </>,
        document.body
      )
    : null;
};

export default LinkAddPopOver;
