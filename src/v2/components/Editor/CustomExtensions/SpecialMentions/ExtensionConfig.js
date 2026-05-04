import { mergeAttributes } from "@tiptap/core";
import Mention from "@tiptap/extension-mention";
import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import { MentionList } from "../Mention/MentionList";
import { createMentionSuggestions } from "../Mention/utils";

const SpecialMentionPluginKey = new PluginKey("special-mention");

const renderLabel = ({ options, node }) =>
  `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;

const suggestion = {
  char: "@@",
  pluginKey: SpecialMentionPluginKey,

  render: () => {
    let reactRenderer;
    let popup;

    return {
      onStart: props => {
        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          theme: "light neeto-editor-mentions-tooltip",
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
          zIndex: 99999,
          arrow: false,
        });
      },

      onUpdate(props) {
        reactRenderer.updateProps(props);

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        reactRenderer.destroy();
      },
    };
  },
};

const SpecialMentions = Mention.extend({
  name: "special-mention",

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      renderLabel({ options: this.options, node }),
    ];
  },
});

export default {
  configure: ({ suggestion: suggestionConfig = {}, ...otherConfig }) =>
    SpecialMentions.configure({
      ...otherConfig,
      suggestion: { ...suggestion, ...suggestionConfig },
    }),
};

export { createMentionSuggestions };
