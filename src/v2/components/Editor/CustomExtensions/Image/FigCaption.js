import { mergeAttributes, Node } from "@tiptap/core";

export default Node.create({
  name: "figcaption",

  content: "text*",

  selectable: false,

  draggable: false,

  parseHTML() {
    return [{ tag: "figcaption" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["figcaption", mergeAttributes(HTMLAttributes), 0];
  },
});
