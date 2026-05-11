import i18n from "i18next";
import {
  Bold,
  Code,
  FileText,
  Highlighter,
  ImageUp,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Smile,
  SquareCode,
  Strikethrough,
  Table,
  Underline,
  Undo,
  Video,
} from "lucide-react";
import { noop } from "neetocist";
import { assoc } from "ramda";

const { t } = i18n;

// eslint-disable-next-line @bigbinary/neeto/use-camel-case-or-pascal-case-for-function-names
export const MENU_OPTIONS = ({
  editor,
  tooltips,
  setMediaUploader,
  handleUploadAttachments,
  isEmojiPickerActive,
  setIsEmojiPickerActive,
}) => [
  {
    Icon: Bold,
    command: () => editor.chain().focus().toggleBold().run(),
    active: editor.isActive("bold"),
    optionName: "bold",
    tooltip: tooltips.bold || t("neetoEditor.menu.bold"),
  },
  {
    Icon: Italic,
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
    Icon: Strikethrough,
    command: () => editor.chain().focus().toggleStrike().run(),
    active: editor.isActive("strike"),
    optionName: "strike",
    tooltip: tooltips.strike || t("neetoEditor.menu.strike"),
  },
  {
    Icon: Highlighter,
    command: () => editor.chain().focus().toggleHighlight().run(),
    active: editor.isActive("highlight"),
    optionName: "highlight",
    tooltip: tooltips.highlight || t("neetoEditor.menu.highlight"),
  },
  {
    Icon: Quote,
    command: () => editor.chain().focus().toggleBlockquote().run(),
    active: editor.isActive("blockquote"),
    optionName: "block-quote",
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
    Icon: SquareCode,
    command: () => editor.chain().focus().toggleCodeBlock().run(),
    active: editor.isActive("codeBlock"),
    optionName: "code-block",
    tooltip: tooltips.codeBlock || t("neetoEditor.menu.codeBlock"),
  },
  {
    Icon: List,
    command: () => editor.chain().focus().toggleBulletList().run(),
    active: editor.isActive("bulletList"),
    optionName: "bullet-list",
    tooltip: tooltips.bulletList || t("neetoEditor.menu.bulletedList"),
  },
  {
    Icon: ListOrdered,
    command: () => editor.chain().focus().toggleOrderedList().run(),
    active: editor.isActive("orderedList"),
    optionName: "ordered-list",
    tooltip: tooltips.orderedList || t("neetoEditor.menu.orderedList"),
  },
  {
    Icon: FileText,
    command: handleUploadAttachments,
    optionName: "attachments",
    tooltip: tooltips.attachments || t("neetoEditor.menu.attachments"),
  },
  {
    Icon: ImageUp,
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
  {
    Icon: Smile,
    command: noop,
    optionName: "emoji",
    tooltip: tooltips.emoji || t("neetoEditor.menu.emoji"),
    isActive: isEmojiPickerActive,
    setActive: setIsEmojiPickerActive,
  },
  {
    Icon: Table,
    command: () =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
    optionName: "table",
    tooltip: tooltips.table || t("neetoEditor.menu.table"),
  },
  {
    Icon: Undo,
    command: () => editor.chain().focus().undo().run(),
    disabled: !editor.can().undo(),
    optionName: "undo",
    tooltip: tooltips.undo || t("neetoEditor.menu.undo"),
  },
  {
    Icon: Redo,
    command: () => editor.chain().focus().redo().run(),
    disabled: !editor.can().redo(),
    optionName: "redo",
    tooltip: tooltips.redo || t("neetoEditor.menu.redo"),
  },
];
