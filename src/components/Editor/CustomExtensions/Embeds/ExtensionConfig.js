import { Node, mergeAttributes, PasteRule } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { COMBINED_REGEX } from "common/constants";

import EmbedComponent from "./EmbedComponent";
import { validateUrl } from "./utils";

export default Node.create({
  name: "external-video",

  addOptions() {
    return { inline: false, HTMLAttributes: {} };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  draggable: true,

  addAttributes() {
    return {
      src: { default: null },

      title: { default: null },

      frameBorder: { default: "0" },

      allow: {
        default:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
      },

      allowfullscreen: { default: "allowfullscreen" },

      figheight: {
        default: 281,
        parseHTML: element => element.getAttribute("figheight"),
      },

      figwidth: {
        default: 500,
        parseHTML: element => element.getAttribute("figwidth"),
      },

      align: {
        default: "left",
        parseHTML: element => element.getAttribute("align"),
      },
    };
  },

  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { align, figheight, figwidth } = node.attrs;

    return [
      "div",
      {
        class: `neeto-editor__video-wrapper neeto-editor__video--${align}`,
      },
      [
        "div",
        {
          class: "neeto-editor__video-iframe",
          style: `width: ${figwidth}px; height: ${figheight}px;`,
        },
        [
          "iframe",
          mergeAttributes(this.options.HTMLAttributes, {
            ...HTMLAttributes,
          }),
        ],
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedComponent);
  },

  addCommands() {
    return {
      setExternalVideo:
        options =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options }),
    };
  },

  addPasteRules() {
    return [
      new PasteRule({
        find: COMBINED_REGEX,
        handler: ({ state, range, match }) => {
          state.tr.delete(range.from, range.to);
          state.tr.setSelection(
            TextSelection.create(state.doc, range.from + 1)
          );

          const validatedUrl = validateUrl(match[0]);
          if (validatedUrl) {
            const node = state.schema.nodes["external-video"].create({
              src: validatedUrl,
            });
            state.tr.insert(range.from, node);
            state.tr.insert(
              range.from + node.nodeSize + 1,
              state.schema.nodes.paragraph.create()
            );

            state.tr.setSelection(
              TextSelection.create(state.tr.doc, range.from + node.nodeSize + 1)
            );
          }
        },
      }),
    ];
  },
});
