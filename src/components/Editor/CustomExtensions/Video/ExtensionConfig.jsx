import { mergeAttributes, Node, PasteRule } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { COMBINED_REGEX } from "common/constants";

import VideoComponent from "./VideoComponent";

import EmbedComponent from "../Embeds/EmbedComponent";
import { validateUrl } from "../Embeds/utils";

const getSharedAttributes = () => ({
  src: {
    default: null,
    parseHTML: element => {
      const iframe = element.querySelector("iframe");
      const video = element.querySelector("video");

      return iframe?.getAttribute("src") || video?.getAttribute("src");
    },
  },
  align: {
    default: "left",
    parseHTML: element =>
      element.getAttribute("align") ||
      element.querySelector("video")?.getAttribute("align"),
  },
  videoType: {
    default: "upload",
    parseHTML: element => {
      const iframe = element.querySelector("iframe");

      return iframe ? "embed" : "upload";
    },
  },
});

const getUploadAttributes = () => ({
  alt: {
    default: "",
    parseHTML: element => element.querySelector("video")?.getAttribute("alt"),
  },
  vidheight: {
    default: "fit-content",
    parseHTML: element =>
      element.querySelector("video")?.getAttribute("vidheight"),
  },
  vidwidth: {
    default: 502,
    parseHTML: element =>
      element.querySelector("video")?.getAttribute("vidwidth"),
  },
});

const getEmbedAttributes = () => ({
  figheight: {
    default: 281,
    parseHTML: element => element.getAttribute("figheight"),
  },
  figwidth: {
    default: 500,
    parseHTML: element => element.getAttribute("figwidth"),
  },
  title: { default: null },
  frameBorder: "0",
  allow:
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
  allowfullscreen: true,
});

const renderEmbedHTML = (node, HTMLAttributes, options) => {
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
        mergeAttributes(options.HTMLAttributes, {
          ...HTMLAttributes,
          allowfullscreen: "",
        }),
      ],
    ],
  ];
};

const renderUploadHTML = (node, HTMLAttributes, options) => {
  const { align, vidheight, vidwidth } = node.attrs;

  const wrapperDivAttrs = {
    class: `neeto-editor__image-wrapper neeto-editor__image--${align}`,
  };

  const heightStyle =
    vidheight === "fit-content" ? "fit-content" : `${vidheight}px`;

  const wrapperLinkAttrs = {
    rel: "noopener noreferrer",
    class: "neeto-editor__image",
    style: `height:${heightStyle};width:${vidwidth}px;display:inline-block;`,
  };

  const captionAttrs = { style: `width:${vidwidth}px;` };

  return [
    "div",
    wrapperDivAttrs,
    [
      "figure",
      mergeAttributes(options.HTMLAttributes, { "data-video": "" }),
      [
        "a",
        wrapperLinkAttrs,
        [
          "video",
          mergeAttributes(HTMLAttributes, {
            preload: "metadata",
            controls: true,
            draggable: false,
            contenteditable: false,
          }),
        ],
      ],
      ["figcaption", captionAttrs, 0],
    ],
  ];
};

const handleVideoPaste = ({ state, range, match }) => {
  state.tr.delete(range.from, range.to);
  state.tr.setSelection(TextSelection.create(state.doc, range.from + 1));

  const validatedUrl = validateUrl(match[0]);
  if (validatedUrl) {
    const node = state.schema.nodes["unified-video"].create({
      src: validatedUrl,
      videoType: "embed",
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
};

const UnifiedVideoExtension = Node.create({
  name: "unified-video",

  addOptions() {
    return { HTMLAttributes: {} };
  },

  group: "block",
  content: "inline*",
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      ...getSharedAttributes(),
      ...getUploadAttributes(),
      ...getEmbedAttributes(),
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-video]",
        getAttrs: node => node.style.fontWeight !== "normal" && null,
        contentElement: "figcaption",
      },
      { tag: "iframe[src]" },
      { tag: "div.neeto-editor__video-wrapper" },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { videoType } = node.attrs;

    return videoType === "embed"
      ? renderEmbedHTML(node, HTMLAttributes, this.options)
      : renderUploadHTML(node, HTMLAttributes, this.options);
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node, ...props }) => {
      const { videoType } = node.attrs;

      return videoType === "embed" ? (
        <EmbedComponent {...{ ...props, node }} />
      ) : (
        <VideoComponent {...{ ...props, node }} />
      );
    });
  },

  addCommands() {
    return {
      setVideo:
        ({ caption, ...attrs }) =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: this.name,
              attrs: { ...attrs, videoType: "upload" },
              content: caption ? [{ type: "text", text: caption }] : [],
            })
            .command(({ tr, commands }) => {
              const { doc, selection } = tr;
              const position = doc.resolve(selection.to).end();

              return commands.setTextSelection(position);
            })
            .run(),

      setExternalVideo:
        options =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { ...options, videoType: "embed" },
          }),
    };
  },

  addPasteRules() {
    return [
      new PasteRule({
        find: COMBINED_REGEX,
        handler: handleVideoPaste,
      }),
    ];
  },
});

export default UnifiedVideoExtension;
