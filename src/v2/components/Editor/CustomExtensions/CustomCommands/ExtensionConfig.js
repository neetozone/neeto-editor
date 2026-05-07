import { Extension } from "@tiptap/core";

export default Extension.create({
  name: "paste-unformatted",

  addCommands() {
    return {
      pasteUnformatted:
        () =>
        async ({ editor }) => {
          const text = await navigator.clipboard.readText();
          editor.commands.insertContent(text);
        },
    };
  },
});
