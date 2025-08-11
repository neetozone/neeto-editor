import { t } from "i18next";
import { isNotEmpty } from "neetocist";
import {
  TextBold,
  TextItalic,
  Underline,
  TextCross,
  Highlight,
  Code,
  ListDot,
  ListNumber,
  Checkbox,
  ImageUpload,
  Quote,
  Undo,
  Redo,
  Video,
  CodeBlock,
  Attachment,
  Link,
} from "neetoicons";
import { prop, not, assoc } from "ramda";

import { EDITOR_OPTIONS } from "src/common/constants";

import {
  MENU_ELEMENT_WIDTHS,
  MENU_ELEMENT_TYPES,
  SHORTCUTS,
} from "./constants.js";

const createMenuOptions = ({
  tooltips,
  setMediaUploader,
  attachmentProps,
  setIsAddLinkActive,
  options,
  mentions,
  addonCommandOptions,
  setIsEmojiPickerActive,
  isEmojiPickerActive,
  runEditorCommand,
  editor,
}) => {
  const fontSizeOptions = options.filter(option => option.match(/^h[1-6]$/));

  return [
    // font
    [
      {
        type: MENU_ELEMENT_TYPES.FONT_SIZE,
        options: fontSizeOptions,
        label: tooltips.fontSize ?? t("neetoEditor.menu.fontSize"),
        isEnabled: isNotEmpty(fontSizeOptions),
        optionName: "fontSizeOptions",
        runEditorCommand,
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: TextBold,
        isEnabled: options.includes(EDITOR_OPTIONS.BOLD),
        command: runEditorCommand(editor =>
          editor?.chain().focus().toggleBold().run()
        ),
        optionName: EDITOR_OPTIONS.BOLD,
        label: tooltips.bold ?? t("neetoEditor.menu.bold"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: TextItalic,
        isEnabled: options.includes(EDITOR_OPTIONS.ITALIC),
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleItalic().run()
        ),
        optionName: EDITOR_OPTIONS.ITALIC,
        label: tooltips.italic ?? t("neetoEditor.menu.italic"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: Link,
        isEnabled: options.includes(EDITOR_OPTIONS.LINK),
        command: () => setIsAddLinkActive(not),
        optionName: EDITOR_OPTIONS.LINK,
        label: tooltips.link ?? t("neetoEditor.menu.link"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: TextCross,
        isEnabled: options.includes(EDITOR_OPTIONS.STRIKETHROUGH),
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleStrike().run()
        ),
        optionName: EDITOR_OPTIONS.STRIKETHROUGH,
        label: tooltips.strike ?? t("neetoEditor.menu.strike"),
      },
      {
        type: MENU_ELEMENT_TYPES.HIGHLIGHT,
        icon: Highlight,
        label: tooltips.highlight ?? t("neetoEditor.menu.highlight"),
        isEnabled: options.includes(EDITOR_OPTIONS.HIGHLIGHT),
        optionName: EDITOR_OPTIONS.HIGHLIGHT,
        editor,
        runEditorCommand,
        tooltipContent: tooltips.highlight ?? t("neetoEditor.menu.highlight"),
      },
    ],
    // list
    [
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: ListDot,
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleBulletList().run()
        ),
        isEnabled: options.includes(EDITOR_OPTIONS.LIST_BULLETS),
        optionName: "bulletList",
        highlight: true,
        label: tooltips.bulletList ?? t("neetoEditor.menu.bulletedList"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: ListNumber,
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleOrderedList().run()
        ),
        isEnabled: options.includes(EDITOR_OPTIONS.LIST_ORDERED),
        optionName: "orderedList",
        highlight: true,
        label: tooltips.orderedList ?? t("neetoEditor.menu.orderedList"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: Checkbox,
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleTaskList().run()
        ),
        isEnabled: options.includes(EDITOR_OPTIONS.TODO_LIST),
        optionName: "todoList",
        highlight: true,
        label: tooltips.todoList ?? t("neetoEditor.menu.todoList"),
      },
    ],
    // block
    [
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: Quote,
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleBlockquote().run()
        ),
        isEnabled: options.includes(EDITOR_OPTIONS.BLOCKQUOTE),
        optionName: "blockquote",
        highlight: true,
        label: tooltips.blockQuote ?? t("neetoEditor.menu.blockQuote"),
      },
      {
        type: MENU_ELEMENT_TYPES.CALLOUT,
        label: tooltips.callout ?? t("neetoEditor.menu.callout"),
        isEnabled: options.includes(EDITOR_OPTIONS.CALLOUT),
        optionName: EDITOR_OPTIONS.CALLOUT,
        editor,
        runEditorCommand,
        tooltipContent: tooltips.callout ?? t("neetoEditor.menu.callout"),
      },
    ],
    // misc
    [
      {
        type: MENU_ELEMENT_TYPES.TABLE,
        label: tooltips.table ?? t("neetoEditor.menu.table"),
        isEnabled: options.includes(EDITOR_OPTIONS.TABLE),
        optionName: EDITOR_OPTIONS.TABLE,
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: Attachment,
        command: () => attachmentProps?.handleUploadAttachments(),
        disabled: attachmentProps?.isDisabled,
        isEnabled: options.includes(EDITOR_OPTIONS.ATTACHMENTS),
        optionName: EDITOR_OPTIONS.ATTACHMENTS,
        label: tooltips.attachments ?? t("neetoEditor.menu.attachments"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: ImageUpload,
        command: () => setMediaUploader(assoc("image", true)),
        isEnabled: options.includes(EDITOR_OPTIONS.IMAGE_UPLOAD),
        optionName: EDITOR_OPTIONS.IMAGE_UPLOAD,
        label: tooltips.imageUpload ?? t("neetoEditor.menu.imageUpload"),
      },
    ],
    // extras
    [
      {
        type: MENU_ELEMENT_TYPES.TEXT_COLOR,
        label: tooltips.textColor ?? t("neetoEditor.menu.textColor"),
        isEnabled: options.includes(EDITOR_OPTIONS.TEXT_COLOR),
        optionName: EDITOR_OPTIONS.TEXT_COLOR,
      },
      {
        type: MENU_ELEMENT_TYPES.EMOJI,
        label: tooltips.emoji ?? t("neetoEditor.menu.emoji"),
        isEnabled: options.includes(EDITOR_OPTIONS.EMOJI),
        optionName: EDITOR_OPTIONS.EMOJI,
        setActive: setIsEmojiPickerActive,
        isActive: isEmojiPickerActive,
      },
      {
        type: MENU_ELEMENT_TYPES.MENTIONS,
        label: tooltips.mention ?? t("neetoEditor.menu.mention"),
        isEnabled: isNotEmpty(mentions),
        optionName: "mentions",
        mentions,
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: Code,
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleCode().run()
        ),
        isEnabled: options.includes(EDITOR_OPTIONS.CODE),
        optionName: EDITOR_OPTIONS.CODE,
        label: tooltips.code ?? t("neetoEditor.menu.code"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: CodeBlock,
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleCodeBlock().run()
        ),
        isEnabled: options.includes(EDITOR_OPTIONS.CODE_BLOCK),
        optionName: "codeBlock",
        label: tooltips.codeBlock ?? t("neetoEditor.menu.codeBlock"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: Video,
        command: () => setMediaUploader(assoc("video", true)),
        isEnabled: options.includes(EDITOR_OPTIONS.VIDEO_UPLOAD),
        optionName: EDITOR_OPTIONS.VIDEO_UPLOAD,
        label: tooltips.videoUpload ?? t("neetoEditor.menu.videoUpload"),
      },
      {
        type: MENU_ELEMENT_TYPES.BUTTON,
        icon: Underline,
        isEnabled: options.includes(EDITOR_OPTIONS.UNDERLINE),
        command: runEditorCommand(editor =>
          editor.chain().focus().toggleUnderline().run()
        ),
        optionName: EDITOR_OPTIONS.UNDERLINE,
        label: tooltips.underline ?? t("neetoEditor.menu.underline"),
      },
    ],
    //addons
    [...addonCommandOptions],
    // history
    [
      {
        icon: Undo,
        command: runEditorCommand(editor =>
          editor.chain().focus().undo().run()
        ),
        isEnabled: options.includes(EDITOR_OPTIONS.UNDO),
        optionName: EDITOR_OPTIONS.UNDO,
        label: tooltips.undo ?? t("neetoEditor.menu.undo"),
        type: MENU_ELEMENT_TYPES.BUTTON,
      },
      {
        icon: Redo,
        command: runEditorCommand(editor =>
          editor.chain().focus().redo().run()
        ),
        isEnabled: options.includes(EDITOR_OPTIONS.REDO),
        optionName: EDITOR_OPTIONS.REDO,
        label: tooltips.redo ?? t("neetoEditor.menu.redo"),
        type: MENU_ELEMENT_TYPES.BUTTON,
      },
    ],
  ];
};

export const buildOptionsFromAddonCommands = ({ commands, runEditorCommand }) =>
  commands.map(option => ({
    ...option,
    type: MENU_ELEMENT_TYPES.BUTTON,
    command: runEditorCommand(editor =>
      option.command?.({
        editor,
        range: {
          from: editor.state?.selection?.to,
          to: editor.state?.selection.to,
        },
      })
    ),
  }));

export const buildMenuOptions = ({
  tooltips,
  options,
  setMediaUploader,
  attachmentProps,
  setIsAddLinkActive,
  mentions = [],
  addonCommands,
  setIsEmojiPickerActive,
  isEmojiPickerActive,
  runEditorCommand,
  editor,
}) => {
  const addonCommandOptions = buildOptionsFromAddonCommands({
    commands: addonCommands,
    runEditorCommand,
  });

  const menuOptions = createMenuOptions({
    tooltips,
    setMediaUploader,
    attachmentProps,
    setIsAddLinkActive,
    options,
    mentions,
    addonCommandOptions,
    setIsEmojiPickerActive,
    isEmojiPickerActive,
    runEditorCommand,
    editor,
  });

  return menuOptions.map(option => option.filter(prop("isEnabled")));
};

export const getCursorPos = (editor, to) => editor?.view.coordsAtPos(to);

export const reGroupMenuItems = (menuRef, menuGroups) => {
  const toolbarWidth = menuRef.current.offsetWidth;
  let totalWidth = 0;
  const visibleMenuGroups = [];
  const invisibleMenuGroups = [];
  menuGroups.forEach((group, groupIndex) => {
    group.forEach((item, itemIndex) => {
      const width = MENU_ELEMENT_WIDTHS[item.type];
      if (totalWidth + width < toolbarWidth) {
        totalWidth += width;
        visibleMenuGroups[groupIndex] = visibleMenuGroups[groupIndex] ?? [];
        visibleMenuGroups[groupIndex][itemIndex] = item;
      } else {
        const visibleMenuGroupsLength = visibleMenuGroups.length;
        const index = groupIndex - visibleMenuGroupsLength + 1;
        invisibleMenuGroups[index] = invisibleMenuGroups[index] ?? [];
        invisibleMenuGroups[index][itemIndex] = item;
      }
    });
  });

  return { visibleMenuGroups, invisibleMenuGroups };
};

export const getLinkPopoverPosition = (editor, popoverRef) => {
  const {
    selection: {
      $to: { pos: selectionEnd },
      $from: { pos: selectionStart },
    },
  } = editor.view.state;
  const selectionLength = selectionEnd - selectionStart;
  let offset = 0;
  if (selectionLength > 1) offset = Math.round(selectionLength / 2);

  if (selectionLength === 1) offset = 1;

  // Calculate the arrow position
  const arrowCoords = editor.view.coordsAtPos(selectionStart + offset);
  const arrowPosition = {
    top: `${arrowCoords.top + 21}px`,
    left: `${arrowCoords.left - 8.5}px`,
  };

  // Calculate the popover position
  const popoverCoords = editor.view.coordsAtPos(selectionStart);
  let adjustedLeft = popoverCoords?.left,
    adjustedTop = popoverCoords?.top;
  if (popoverRef?.current) {
    const popoverRect = popoverRef.current?.getBoundingClientRect();

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const maxLeft = screenWidth - popoverRect.width;
    const maxTop = screenHeight - popoverRect.height - 50;

    adjustedLeft = popoverCoords?.left
      ? Math.min(popoverCoords.left - 50, maxLeft)
      : 0;

    adjustedTop = popoverCoords?.top
      ? Math.min(popoverCoords.top - 22, maxTop)
      : 0;
  } else {
    adjustedLeft = popoverCoords.left - 50;
    adjustedTop = popoverCoords.top - 22;
  }

  const popoverPosition = {
    top: `${adjustedTop}px`,
    left: `${adjustedLeft}px`,
  };

  return { arrowPosition, popoverPosition };
};

export function renderTooltipContent(label, optionName) {
  const shortcut = SHORTCUTS[optionName];
  if (!shortcut) return label;

  const isMac = () =>
    typeof window !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent);

  const key = isMac() ? shortcut.mac : shortcut.win;

  return `${label} (${key})`;
}
