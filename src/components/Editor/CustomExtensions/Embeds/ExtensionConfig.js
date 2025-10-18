import { Node, mergeAttributes, PasteRule } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import classnames from "classnames";
import { COMBINED_REGEX } from "common/constants";

import EmbedComponent from "./EmbedComponent";
import { validateUrl } from "./utils";

import { DEFAULT_ASPECT_RATIO } from "../../MediaUploader/constants";

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

      allowfullscreen: { default: true },

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

      aspectRatio: {
        default: DEFAULT_ASPECT_RATIO,
        parseHTML: element => {
          const iframe = element.querySelector(".neeto-editor__video-iframe");

          return (
            iframe?.getAttribute("data-aspect-ratio") || DEFAULT_ASPECT_RATIO
          );
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "iframe[src]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { align, figheight, figwidth, aspectRatio } = node.attrs;

    return [
      "div",
      {
        class: `neeto-editor__video-wrapper neeto-editor__video--${align}`,
      },
      [
        "div",
        {
          class: classnames("neeto-editor__video-iframe", {
            "neeto-editor-aspect-1-1": aspectRatio === "1/1",
            "neeto-editor-aspect-16-9": aspectRatio === "16/9",
            "neeto-editor-aspect-9-16": aspectRatio === "9/16",
            "neeto-editor-aspect-4-3": aspectRatio === "4/3",
            "neeto-editor-aspect-3-2": aspectRatio === "3/2",
          }),
          style: `width: ${figwidth}px; height: ${figheight}px;`,
          "data-aspect-ratio": aspectRatio,
        },
        [
          "iframe",
          mergeAttributes(this.options.HTMLAttributes, {
            ...HTMLAttributes,
            allowfullscreen: true,
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
