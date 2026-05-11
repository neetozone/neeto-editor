import { Extension } from "@tiptap/core";

const KeyboardShortcuts = ({ onSubmit, shortcuts, isBlockQuoteActive }) =>
  Extension.create({
    name: "keyboard-shortcuts",

    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => {
          onSubmit?.(this.editor.getHTML());

          return true;
        },
        "Mod-Shift-b": () => {
          if (isBlockQuoteActive) {
            this.editor.chain().focus().toggleBlockquote().run();

            return true;
          }

          return false;
        },
        ...shortcuts,
      };
    },
  });

export default {
  configure: ({ onSubmit, shortcuts, isBlockQuoteActive }) =>
    KeyboardShortcuts({ onSubmit, shortcuts, isBlockQuoteActive }),
};
