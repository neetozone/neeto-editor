import { memo, useEffect, useRef, useState } from "react";

import classnames from "classnames";
import DOMPurify from "dompurify";
import CopyToClipboardButton from "neetomolecules/CopyToClipboardButton";
import { isNil } from "ramda";
import { createRoot } from "react-dom/client";

import { EDITOR_SIZES } from "src/common/constants";
import "src/styles/editor/editor-content.scss";
import { removeEmptyTags } from "utils";

import {
  EDITOR_CONTENT_CLASS_NAME,
  EDITOR_CONTENT_DEFAULT_CONFIGURATION,
  SANITIZE_OPTIONS,
} from "./constants";
import ImagePreview from "./ImagePreview";
import {
  substituteVariables,
  applyLineHighlighting,
  applySyntaxHighlightingAndLineNumbers,
  convertPlainTextToHtml,
} from "./utils";
import { buildHeaderLinks } from "./utils/headers";
import {
  handleTodoCheckboxClick,
  syncTodoCheckboxStates,
} from "./utils/todoCheckbox";

const EditorContent = ({
  content = "",
  variables = [],
  className,
  size = EDITOR_SIZES.SMALL,
  configuration = EDITOR_CONTENT_DEFAULT_CONFIGURATION,
  onChange,
  onClick,
  ...otherProps
}) => {
  const [imagePreviewDetails, setImagePreviewDetails] = useState(null);
  const editorContentRef = useRef(null);

  const htmlContent = convertPlainTextToHtml(
    substituteVariables(
      applySyntaxHighlightingAndLineNumbers(removeEmptyTags(content)),
      variables
    )
  );
  const sanitize = DOMPurify.sanitize;

  const handleContentClick = event => {
    handleTodoCheckboxClick(event, editorContentRef.current, onChange);

    onClick?.(event);
  };

  const injectCopyButtonToCodeBlocks = () => {
    const preTags = editorContentRef.current?.querySelectorAll(
      `.${EDITOR_CONTENT_CLASS_NAME} pre`
    );

    preTags.forEach(preTag => {
      const button = document.createElement("div");
      button.className = "neeto-editor-codeblock-options";
      const root = createRoot(button);
      root.render(
        <CopyToClipboardButton
          size="small"
          style="tertiary"
          value={preTag.textContent}
        />
      );
      preTag.appendChild(button);
    });
  };

  const bindImageClickListener = () => {
    const figureTags = editorContentRef.current?.querySelectorAll(
      `.${EDITOR_CONTENT_CLASS_NAME} figure`
    );

    figureTags.forEach(figureTag => {
      const image = figureTag.querySelector("img");
      const link = figureTag.querySelector("a");
      if (isNil(image) || isNil(link)) return;

      figureTag.addEventListener("click", event => {
        event.preventDefault();
        const caption = figureTag.querySelector("figcaption").innerText;
        setImagePreviewDetails({ src: image.src, caption });
      });
    });
  };

  useEffect(() => {
    injectCopyButtonToCodeBlocks();
    bindImageClickListener();
    syncTodoCheckboxStates(editorContentRef.current);
    applyLineHighlighting(editorContentRef.current);
    configuration.enableHeaderLinks &&
      buildHeaderLinks(editorContentRef.current);
  }, [content, configuration.enableHeaderLinks]);

  return (
    <>
      <div
        data-cy="neeto-editor-content"
        ref={editorContentRef}
        className={classnames(EDITOR_CONTENT_CLASS_NAME, {
          [className]: className,
          [`neeto-editor-size--${size}`]: true,
        })}
        dangerouslySetInnerHTML={{
          __html: sanitize(htmlContent, SANITIZE_OPTIONS),
        }}
        onClick={handleContentClick}
        {...otherProps}
      />
      {imagePreviewDetails && (
        <ImagePreview {...{ imagePreviewDetails, setImagePreviewDetails }} />
      )}
    </>
  );
};

export default memo(EditorContent);
