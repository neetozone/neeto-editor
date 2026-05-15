import { mergeAttributes, Node, PasteRule } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import classnames from "classnames";
import { COMBINED_REGEX } from "common/constants";

import VideoComponent from "./VideoComponent";

import { DEFAULT_ASPECT_RATIO } from "../../MediaUploader/constants";
import EmbedComponent from "../Embeds/EmbedComponent";
import {
  validateUrl,
  updateEmbedWithDetectedDimensions,
} from "../Embeds/utils";

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
  border: {
    default: true,
    parseHTML: element =>
      element.querySelector("video")?.getAttribute("data-border") === "true" ||
      element.querySelector("iframe")?.getAttribute("data-border") === "true",
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
  originalFigheight: {
    default: 281,
    parseHTML: element =>
      element.getAttribute("originalfigheight") ||
      element.getAttribute("figheight"),
  },
  originalFigwidth: {
    default: 500,
    parseHTML: element =>
      element.getAttribute("originalfigwidth") ||
      element.getAttribute("figwidth"),
  },
  aspectRatio: {
    default: DEFAULT_ASPECT_RATIO,
    parseHTML: element => {
      const iframe = element.querySelector(".neeto-editor__video-iframe");

      return iframe?.getAttribute("data-aspect-ratio") || DEFAULT_ASPECT_RATIO;
    },
  },
  title: { default: null },
  frameBorder: "0",
  allow:
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
  allowfullscreen: true,
});

const renderEmbedHTML = (node, HTMLAttributes, options) => {
  const {
    align,
    figheight,
    figwidth,
    originalFigheight,
    originalFigwidth,
    border,
    aspectRatio,
  } = node.attrs;
  const isAuto = aspectRatio === "auto";

  const wrapperStyle = isAuto
    ? `width: ${figwidth}px; aspect-ratio: ${figwidth} / ${figheight};`
    : `width: ${figwidth}px; height: ${figheight}px;`;

  return [
    "div",
    {
      class: classnames(
        "neeto-editor__video-wrapper",
        `neeto-editor__video--${align}`,
        { "neeto-editor__video--bordered": border }
      ),
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
        style: wrapperStyle,
        "data-aspect-ratio": isAuto ? "auto" : aspectRatio,
        originalfigwidth: originalFigwidth,
        originalfigheight: originalFigheight,
      },
      [
        "iframe",
        mergeAttributes(options.HTMLAttributes, {
          ...HTMLAttributes,
          allowfullscreen: true,
          "data-border": border,
        }),
      ],
    ],
  ];
};

const renderUploadHTML = (node, HTMLAttributes, options) => {
  const { align, vidheight, vidwidth, border } = node.attrs;

  const wrapperDivAttrs = {
    class: classnames(
      "neeto-editor__image-wrapper",
      `neeto-editor__image--${align}`,
      { "neeto-editor__image--bordered": border }
    ),
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
            "data-border": border,
          }),
        ],
      ],
      ["figcaption", captionAttrs, 0],
    ],
  ];
};

const handleVideoPaste = ({ state, range, match, editor }) => {
  state.tr.delete(range.from, range.to);
  state.tr.setSelection(TextSelection.create(state.doc, range.from + 1));

  const validatedUrl = validateUrl(match[0]);
  if (!validatedUrl) return;

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

  // Paste-rule handlers must be synchronous, so we kick off detection and let
  // the helper locate and patch the placeholder node when oEmbed resolves.
  updateEmbedWithDetectedDimensions({
    editor,
    originalUrl: match[0],
    validatedSrc: validatedUrl,
  });
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
        tag: "div.neeto-editor__image-wrapper",
        getAttrs: node => {
          const figure = node.querySelector("figure[data-video]");

          if (!figure) return false;

          const videoEl = figure.querySelector("video");
          const iframeEl = figure.querySelector("iframe");

          if (!videoEl && !iframeEl) return false;

          return node.style.fontWeight !== "normal" && null;
        },
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
    const { editor } = this;

    return [
      new PasteRule({
        find: COMBINED_REGEX,
        handler: args => handleVideoPaste({ ...args, editor }),
      }),
    ];
  },
});

export default UnifiedVideoExtension;
