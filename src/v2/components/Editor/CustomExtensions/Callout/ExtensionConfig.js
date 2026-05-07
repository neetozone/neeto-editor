import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { findBy } from "neetocist";
import { Megaphone } from "neetoicons/misc";
import ReactDOM from "react-dom/server";

import { CALLOUT_TYPES } from "src/v2/components/Editor/Menu/Fixed/components/CalloutDropdown/constants";

import CalloutComponent from "./CalloutComponent";

export default Node.create({
  name: "callout",

  inline: false,

  group: "block",

  content: "block+",

  defining: true,

  draggable: true,

  addAttributes() {
    return {
      type: {
        default: "default",
        parseHTML: element => element.getAttribute("data-type") || "default",
        renderHTML: attributes => ({ "data-type": attributes.type }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-emoji]", contentElement: ".callout-content" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { type } = node.attrs;
    const Icon = findBy({ type }, CALLOUT_TYPES)?.icon || Megaphone;
    // eslint-disable-next-line react/jsx-filename-extension
    const svgString = ReactDOM.renderToStaticMarkup(<Icon />);

    const svgContainer = document.createElement("div");
    svgContainer.innerHTML = svgString;
    const svgNode = svgContainer.firstChild;

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `neeto-editor__callout neeto-editor__callout--${type}`,
        "data-emoji": type,
      }),
      [
        "div",
        { class: "callout-container" },
        ["span", { class: "callout-emoji" }, svgNode],
        ["div", { class: "callout-content" }, 0],
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },

  addCommands() {
    return {
      setCallout:
        (attributes = {}) =>
        ({ chain }) => {
          const { type = "default" } = attributes;

          return chain()
            .toggleWrap(this.name, { type })
            .command(({ tr, state, dispatch }) => {
              const { selection } = state;
              const { $from } = selection;

              const calloutNode = $from.node($from.depth - 1);

              if (calloutNode?.type.name === "callout") {
                const pos = $from.after($from.depth - 1);
                const nextNode = state.doc.nodeAt(pos);

                if (!nextNode || nextNode.type.name !== "paragraph") {
                  tr.insert(pos, state.schema.nodes.paragraph.create());
                }
              }

              if (dispatch) {
                dispatch(tr);
              }

              return true;
            })
            .focus()
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { state, commands } = this.editor;
        const { $from, empty } = state.selection;

        if (!empty) return false;

        if ($from.parentOffset === 0) {
          const currentNode = $from.parent;

          if (currentNode.content.size === 0) {
            return commands.lift(this.name);
          }

          const calloutNode = $from.node($from.depth - 1);
          if (calloutNode?.type.name === "callout") {
            return commands.lift(this.name);
          }
        }

        return false;
      },
      ArrowDown: () => {
        const { state, commands } = this.editor;
        const { $from, empty } = state.selection;

        if (!empty) return false;

        const currentNode = $from.parent;
        const calloutNode = $from.node($from.depth - 1);

        if (calloutNode?.type.name === "callout") {
          const isAtEnd = $from.parentOffset === currentNode.content.size;

          const calloutContent = calloutNode.content;
          const currentNodeIndex = $from.index($from.depth - 1);
          const isLastNode = currentNodeIndex === calloutContent.childCount - 1;

          if (isAtEnd && isLastNode) {
            const pos = $from.after($from.depth - 1);

            if (pos < state.doc.content.size) {
              const nextNode = state.doc.nodeAt(pos);
              if (nextNode) {
                const endPos = pos + nextNode.nodeSize - 1;

                return commands.setTextSelection(endPos);
              }

              return commands.setTextSelection(pos);
            }

            return (
              commands.insertContentAt(pos, { type: "paragraph" }) &&
              commands.setTextSelection(pos + 1)
            );
          }
        }

        return false;
      },
    };
  },
});
