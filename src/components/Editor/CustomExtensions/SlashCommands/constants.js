import { EDITOR_OPTIONS } from "common/constants";
import { t } from "i18next";
import { noop } from "neetocist";
import {
  TextP,
  TextH1,
  TextH2,
  TextH3,
  TextH4,
  TextH5,
  ListDot,
  ListNumber,
  Checkbox,
  Blockquote,
  ImageUpload,
  CodeBlock,
  Smiley,
  Minus,
  Video,
  Notes,
  Column,
  TextBold,
  TextItalic,
  Underline,
  Link,
  Attachment,
  MessageSquare,
  Down,
} from "neetoicons";

export const MENU_ITEMS = [
  {
    optionName: EDITOR_OPTIONS.PARAGRAPH,
    title: t("neetoEditor.menu.normalText"),
    description: t("neetoEditor.menu.normalTextDescription"),
    Icon: TextP,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("paragraph").run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.BOLD,
    title: t("neetoEditor.menu.bold"),
    description: t("neetoEditor.menu.boldDescription"),
    Icon: TextBold,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBold().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.ITALIC,
    title: t("neetoEditor.menu.italic"),
    description: t("neetoEditor.menu.italicDescription"),
    Icon: TextItalic,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleItalic().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.UNDERLINE,
    title: t("neetoEditor.menu.underline"),
    description: t("neetoEditor.menu.underlineDescription"),
    Icon: Underline,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleUnderline().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.H1,
    title: t("neetoEditor.menu.heading1"),
    description: t("neetoEditor.menu.h1Description"),
    Icon: TextH1,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.H2,
    title: t("neetoEditor.menu.heading2"),
    description: t("neetoEditor.menu.h2Description"),
    Icon: TextH2,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.H3,
    title: t("neetoEditor.menu.heading3"),
    description: t("neetoEditor.menu.h3Description"),
    Icon: TextH3,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.H4,
    title: t("neetoEditor.menu.heading4"),
    description: t("neetoEditor.menu.h4Description"),
    Icon: TextH4,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 4 })
        .run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.H5,
    title: t("neetoEditor.menu.heading5"),
    description: t("neetoEditor.menu.h5Description"),
    Icon: TextH5,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 5 })
        .run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.LIST_ORDERED,
    title: t("neetoEditor.menu.numberedList"),
    description: t("neetoEditor.menu.numberedListDescription"),
    Icon: ListNumber,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.LIST_BULLETS,
    title: t("neetoEditor.menu.bulletList"),
    description: t("neetoEditor.menu.bulletListDescription"),
    Icon: ListDot,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.LINK,
    title: t("neetoEditor.menu.link"),
    description: t("neetoEditor.menu.linkDescription"),
    Icon: Link,
    command: noop,
  },
  {
    optionName: EDITOR_OPTIONS.ATTACHMENTS,
    title: t("neetoEditor.menu.file"),
    description: t("neetoEditor.menu.attachmentsDescription"),
    Icon: Attachment,
    command: noop,
  },
  {
    optionName: EDITOR_OPTIONS.TODO_LIST,
    title: t("neetoEditor.menu.todoList"),
    description: t("neetoEditor.menu.todoListDescription"),
    Icon: Checkbox,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.IMAGE_UPLOAD,
    title: t("neetoEditor.menu.image"),
    description: t("neetoEditor.menu.imageDescription"),
    Icon: ImageUpload,
    command: noop,
  },
  {
    optionName: EDITOR_OPTIONS.VIDEO_UPLOAD,
    title: t("neetoEditor.menu.video"),
    description: t("neetoEditor.menu.videoDescription"),
    Icon: Video,
    command: noop,
  },
  {
    optionName: EDITOR_OPTIONS.BLOCKQUOTE,
    title: t("neetoEditor.menu.blockQuote"),
    description: t("neetoEditor.menu.blockQuoteDescription"),
    Icon: Blockquote,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.CODE_BLOCK,
    title: t("neetoEditor.menu.codeBlock"),
    description: t("neetoEditor.menu.codeDescription"),
    Icon: CodeBlock,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.EMOJI,
    title: t("neetoEditor.menu.emoji"),
    description: t("neetoEditor.menu.emojiDescription"),
    Icon: Smiley,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent("::").run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.DIVIDER,
    title: t("neetoEditor.menu.divider"),
    description: t("neetoEditor.menu.dividerDescription"),
    Icon: Minus,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    optionName: EDITOR_OPTIONS.PASTE_UNFORMATTED,
    title: t("neetoEditor.menu.pasteUnformatted"),
    description: t("neetoEditor.menu.pasteUnformattedDescription"),
    Icon: Notes,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).pasteUnformatted().run(),
  },
  {
    optionName: EDITOR_OPTIONS.TABLE,
    title: t("neetoEditor.menu.table"),
    description: t("neetoEditor.menu.tableDescription"),
    Icon: Column,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    optionName: EDITOR_OPTIONS.CALLOUT,
    title: t("neetoEditor.menu.callout"),
    description: t("neetoEditor.menu.calloutDescription"),
    Icon: MessageSquare,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setCallout({ type: "default" })
        .run();
    },
    items: [
      {
        optionName: `${EDITOR_OPTIONS.CALLOUT}_default`,
        title: t("neetoEditor.menu.calloutDefault"),
        description: t("neetoEditor.menu.calloutDescription"),
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setCallout({ type: "default" })
            .run();
        },
      },
      {
        optionName: `${EDITOR_OPTIONS.CALLOUT}_info`,
        title: t("neetoEditor.menu.calloutInfo"),
        description: t("neetoEditor.menu.calloutDescription"),
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setCallout({ type: "info" })
            .run();
        },
      },
      {
        optionName: `${EDITOR_OPTIONS.CALLOUT}_warning`,
        title: t("neetoEditor.menu.calloutWarning"),
        description: t("neetoEditor.menu.calloutDescription"),
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setCallout({ type: "warning" })
            .run();
        },
      },
      {
        optionName: `${EDITOR_OPTIONS.CALLOUT}_error`,
        title: t("neetoEditor.menu.calloutError"),
        description: t("neetoEditor.menu.calloutDescription"),
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setCallout({ type: "error" })
            .run();
        },
      },
      {
        optionName: `${EDITOR_OPTIONS.CALLOUT}_success`,
        title: t("neetoEditor.menu.calloutSuccess"),
        description: t("neetoEditor.menu.calloutDescription"),
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setCallout({ type: "success" })
            .run();
        },
      },
    ],
  },
  {
    optionName: EDITOR_OPTIONS.TOGGLE_LIST,
    title: t("neetoEditor.menu.toggleList"),
    description: t("neetoEditor.menu.toggleListDescription"),
    Icon: Down,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setToggleList().run();
    },
  },
];

export const NO_RESULT_MENU_ITEM = {
  title: t("neetoEditor.menu.noResults"),
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).run();
  },
};
