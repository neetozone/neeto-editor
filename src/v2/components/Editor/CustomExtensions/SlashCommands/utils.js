import { EDITOR_OPTIONS } from "common/constants";
import { assoc } from "ramda";

import { MENU_ITEMS } from "./constants";

const imageCommand =
  setMediaUploader =>
  ({ editor, range }) => {
    setMediaUploader(assoc("image", true));
    editor.chain().focus().deleteRange(range).run();
  };

const videoCommand =
  setMediaUploader =>
  ({ editor, range }) => {
    setMediaUploader(assoc("video", true));
    editor.chain().focus().deleteRange(range).run();
  };

const linkCommand =
  setIsAddLinkActive =>
  ({ editor, range }) => {
    setIsAddLinkActive(true);
    editor.chain().focus().deleteRange(range).run();
  };

const attachmentCommand =
  attachmentProps =>
  ({ editor, range }) => {
    attachmentProps?.handleUploadAttachments();
    editor.chain().focus().deleteRange(range).run();
  };

const neetoKbArticleCommand =
  setIsNeetoKbArticleActive =>
  ({ editor, range }) => {
    // Get cursor position for positioning the modal
    const cursorPos = editor.view.coordsAtPos(range.from);
    setIsNeetoKbArticleActive({
      active: true,
      editor,
      range,
      cursorPos,
    });
    editor.chain().focus().deleteRange(range).run();
  };

export const buildCommandItems = ({
  options,
  addonCommands,
  setMediaUploader,
  setIsAddLinkActive,
  attachmentProps,
  setIsNeetoKbArticleActive,
}) => {
  const commandItems = MENU_ITEMS.map(item => {
    if (item.optionName === EDITOR_OPTIONS.IMAGE_UPLOAD) {
      return assoc("command", imageCommand(setMediaUploader), item);
    } else if (item.optionName === EDITOR_OPTIONS.VIDEO_UPLOAD) {
      return assoc("command", videoCommand(setMediaUploader), item);
    } else if (item.optionName === EDITOR_OPTIONS.LINK) {
      return assoc("command", linkCommand(setIsAddLinkActive), item);
    } else if (item.optionName === EDITOR_OPTIONS.ATTACHMENTS) {
      return assoc("command", attachmentCommand(attachmentProps), item);
    } else if (item.optionName === EDITOR_OPTIONS.NEETO_KB_ARTICLE) {
      return assoc(
        "command",
        neetoKbArticleCommand(setIsNeetoKbArticleActive),
        item
      );
    }

    return item;
  });

  const permittedCommandItems = commandItems.filter(({ optionName }) =>
    options.includes(optionName)
  );

  const adddonCommandItems = addonCommands.map(command => ({
    ...command,
    title: command.label,
    Icon: command.icon,
  }));

  return [...permittedCommandItems, ...adddonCommandItems];
};
