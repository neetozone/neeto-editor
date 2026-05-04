import { Node, mergeAttributes } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";

import VariableComponent from "./VariableComponent";

const VariablePluginKey = new PluginKey("variables");
const Variable = Node.create({
  name: "variable",
  addOptions() {
    return {
      HTMLAttributes: { class: "neeto-editor-variable" },
      charOpen: "{{",
      charClose: "}}",
      renderLabel({ options, node }) {
        return `${options.charOpen}${node.attrs.id || node.attrs.label}${
          options.charClose
        }`;
      },
      suggestion: {},
    };
  },
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute("data-id"),
        renderHTML: attributes => {
          if (!attributes.id) return {};

          return { "data-id": attributes.id };
        },
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute("data-label"),
        renderHTML: attributes => {
          if (!attributes.label) return {};

          return { "data-label": attributes.label };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-variable]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        { "data-variable": "" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderLabel({ options: this.options, node }),
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({ options: this.options, node });
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableComponent);
  },

  addCommands() {
    return {
      setVariable:
        attributes =>
        ({ chain }) => {
          chain()
            .focus()
            .insertContent([
              { type: this.name, attrs: attributes },
              { type: "text", text: " " },
            ])
            .run();
        },
    };
  },
});

export default Variable;

export { VariablePluginKey };
