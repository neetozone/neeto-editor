import { useState } from "react";

import { BubbleMenu as BubbleMenuTipTap } from "@tiptap/react";
import classnames from "classnames";
import { EDITOR_OPTIONS } from "common/constants";
import { isNotPresent } from "neetocist";
import { roundArrow } from "tippy.js";
import "tippy.js/dist/svg-arrow.css";

import Options from "./Options";

const Bubble = ({
  editor,
  options: textOptions,
  mentions = [],
  setMediaUploader,
  tooltips = {},
  attachmentProps,
  isEmojiPickerActive,
  setIsEmojiPickerActive,
}) => {
  const [isInvalidLink, setIsInvalidLink] = useState(false);
  const [isLinkOptionActive, setIsLinkOptionActive] = useState(false);
  const [isTableOptionActive, setIsTableOptionActive] = useState(false);
  const selectedNode = editor && editor.view.state.selection.node;
  const isImageNodeSelected =
    selectedNode && selectedNode.type.name === "image";

  const bubbleMenuOptions = [
    EDITOR_OPTIONS.BOLD,
    EDITOR_OPTIONS.ITALIC,
    EDITOR_OPTIONS.UNDERLINE,
    EDITOR_OPTIONS.STRIKETHROUGH,
    EDITOR_OPTIONS.LINK,
  ];

  const noTextOptions = isNotPresent(
    textOptions.filter(option => bubbleMenuOptions.includes(option))
  );

  if (!editor || (!isImageNodeSelected && noTextOptions)) {
    return null;
  }

  return (
    <div>
      <BubbleMenuTipTap
        {...{ editor }}
        className={classnames("neeto-editor-bubble-menu", {
          "neeto-editor-bubble-menu-animate-shake": isInvalidLink,
        })}
        tippyOptions={{
          arrow: roundArrow,
          zIndex: 99999,
          onHide: () => {
            setIsLinkOptionActive(false);
            setIsTableOptionActive(false);
          },
          theme: "light neeto-editor-bubble-menu-tippy-box",
          maxWidth: 500,
        }}
      >
        <Options
          {...{
            attachmentProps,
            editor,
            isEmojiPickerActive,
            isLinkOptionActive,
            isTableOptionActive,
            mentions,
            setIsEmojiPickerActive,
            setIsInvalidLink,
            setIsLinkOptionActive,
            setIsTableOptionActive,
            setMediaUploader,
            tooltips,
          }}
          options={textOptions}
        />
      </BubbleMenuTipTap>
    </div>
  );
};

export default Bubble;
