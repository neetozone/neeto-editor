import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

export default Extension.create({
  name: "HighlightInternal",

  addOptions() {
    return { types: ["textStyle"] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: element =>
              element.style.backgroundColor.replace(/['"]+/g, ""),
            renderHTML: attributes => {
              if (!attributes.backgroundColor) {
                return {};
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setHighlightInternal:
        color =>
        ({ chain }) =>
          chain().setMark("textStyle", { backgroundColor: color }).run(),
      unsetHighlightInternal:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { backgroundColor: null }).run(),
    };
  },
});
