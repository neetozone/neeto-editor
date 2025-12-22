import { t } from "i18next";
import {
  Quote,
  Attachment,
  CodeBlock,
  Code,
  Highlight,
  Link,
  TextBold,
  TextCross,
  TextItalic,
  Underline,
  ListDot,
  ListNumber,
  ImageUpload,
  Video,
  Undo,
  Redo,
  TextP,
  TextH1,
  TextH2,
  TextH3,
} from "neetoicons";
import { Button } from "neetoui";
import { assoc, fromPairs, not, prop } from "ramda";

import { EDITOR_OPTIONS } from "src/common/constants";
import { generateFocusProps } from "utils/focusHighlighter";

export const createMenuOptions = ({
  tooltips,
  editor,
  setMediaUploader,
  attachmentProps,
  setIsAddLinkActive,
}) => ({
  font: [
    {
      Icon: TextBold,
      command: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      optionName: "bold",
      tooltip: tooltips.bold || t("neetoEditor.menu.bold"),
    },
    {
      Icon: TextItalic,
      command: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      optionName: "italic",
      tooltip: tooltips.italic || t("neetoEditor.menu.italic"),
    },
    {
      Icon: Underline,
      command: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      optionName: "underline",
      tooltip: tooltips.underline || t("neetoEditor.menu.underline"),
    },
    {
      Icon: Link,
      command: () => setIsAddLinkActive(not),
      optionName: "link",
      tooltip: "Link",
    },
    {
      Icon: TextCross,
      command: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      optionName: "strike",
      tooltip: tooltips.strike || t("neetoEditor.menu.strike"),
    },
    {
      Icon: Highlight,
      command: () => editor.chain().focus().toggleHighlight().run(),
      active: editor.isActive("highlight"),
      optionName: "highlight",
      tooltip: tooltips.highlight || t("neetoEditor.menu.highlight"),
    },
  ],
  block: [
    {
      Icon: Quote,
      command: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      optionName: "block-quote",
      highlight: true,
      tooltip: tooltips.blockQuote || t("neetoEditor.menu.blockQuote"),
    },
    {
      Icon: Code,
      command: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
      optionName: "code",
      tooltip: tooltips.code || t("neetoEditor.menu.code"),
    },
    {
      Icon: CodeBlock,
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      optionName: "code-block",
      tooltip: tooltips.codeBlock || t("neetoEditor.menu.codeBlock"),
    },
  ],
  list: [
    {
      Icon: ListDot,
      command: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      optionName: "bullet-list",
      highlight: true,
      tooltip: tooltips.bulletList || t("neetoEditor.menu.bulletedList"),
    },
    {
      Icon: ListNumber,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      optionName: "ordered-list",
      highlight: true,
      tooltip: tooltips.orderedList || t("neetoEditor.menu.orderedList"),
    },
  ],
  misc: [
    {
      Icon: Attachment,
      command: attachmentProps?.handleUploadAttachments,
      disabled: attachmentProps?.isDisabled,
      active: false,
      optionName: "attachments",
      tooltip: tooltips.attachments || t("neetoEditor.menu.attachments"),
    },
    {
      Icon: ImageUpload,
      command: () => setMediaUploader(assoc("image", true)),
      optionName: "image-upload",
      tooltip: tooltips.imageUpload || t("neetoEditor.menu.imageUpload"),
    },
    {
      Icon: Video,
      command: () => setMediaUploader(assoc("video", true)),
      optionName: "video-upload",
      tooltip: tooltips.videoUpload || t("neetoEditor.menu.videoUpload"),
    },
  ],
  right: [
    {
      Icon: Undo,
      command: () => editor.chain().focus().undo().run(),
      active: false,
      disabled: !editor.can().undo(),
      optionName: "undo",
      tooltip: tooltips.undo || t("neetoEditor.menu.undo"),
    },
    {
      Icon: Redo,
      command: () => editor.chain().focus().redo().run(),
      active: false,
      disabled: !editor.can().redo(),
      optionName: "redo",
      tooltip: tooltips.redo || t("neetoEditor.menu.redo"),
    },
  ],
});

export const buildBubbleMenuOptions = ({
  tooltips,
  editor,
  options,
  setMediaUploader,
  attachmentProps,
  setIsAddLinkActive,
}) => {
  const menuOptions = createMenuOptions({
    tooltips,
    editor,
    setMediaUploader,
    attachmentProps,
    setIsAddLinkActive,
  });

  return fromPairs(
    ["font", "block", "list", "misc", "right"].map(option => [
      option,
      menuOptions[option].filter(item => options.includes(item.optionName)),
    ])
  );
};

export const getTextMenuDropdownOptions = ({ editor, options }) => {
  const textOptions = {
    [EDITOR_OPTIONS.H1]: {
      optionName: "Heading 1",
      icon: TextH1,
      active: editor.isActive("heading", { level: 1 }),
      command: () =>
        editor.chain().focus().setNode("heading", { level: 1 }).run(),
    },
    [EDITOR_OPTIONS.H2]: {
      optionName: "Heading 2",
      icon: TextH2,
      active: editor.isActive("heading", { level: 2 }),
      command: () =>
        editor.chain().focus().setNode("heading", { level: 2 }).run(),
    },
    [EDITOR_OPTIONS.H3]: {
      optionName: "Heading 3",
      icon: TextH3,
      active: editor.isActive("heading", { level: 3 }),
      command: () =>
        editor.chain().focus().setNode("heading", { level: 3 }).run(),
    },
    [EDITOR_OPTIONS.PARAGRAPH]: {
      optionName: "Text",
      icon: TextP,
      active: editor.isActive("paragraph"),
      command: () => editor.chain().focus().setNode("paragraph").run(),
    },
  };

  const result = [];
  options.forEach(option => {
    if (!textOptions[option]) return;
    result.push(textOptions[option]);
  });

  return result;
};

export const getNodeIcon = options =>
  options.find(prop("active"))?.icon || TextP;

export const renderOptionButton = ({
  tooltip,
  Icon,
  command,
  active,
  optionName,
  highlight,
}) => (
  <Button
    className="neeto-editor-bubble-menu__item"
    data-testid={`neeto-editor-bubble-menu-${optionName}-option`}
    icon={Icon}
    key={optionName}
    size="medium"
    style={active ? "secondary" : "text"}
    tooltipProps={{
      content: tooltip,
      position: "bottom",
      theme: "dark",
    }}
    onClick={command}
    {...generateFocusProps(highlight)}
  />
);
