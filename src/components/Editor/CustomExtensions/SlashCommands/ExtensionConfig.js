import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { isEmpty } from "ramda";
import tippy from "tippy.js";

import {
  highlightFocussedNode,
  resetFocussedNode,
} from "utils/focusHighlighter";

import CommandsList from "./CommandsList";
import { NO_RESULT_MENU_ITEM } from "./constants";
import { buildCommandItems } from "./utils";

const CommandsPluginKey = new PluginKey("commands");

export default {
  configure: ({
    addonCommands,
    options,
    setMediaUploader,
    setIsAddLinkActive,
    attachmentProps,
  }) => {
    const commandItems = buildCommandItems({
      options,
      addonCommands,
      setMediaUploader,
      setIsAddLinkActive,
      attachmentProps,
    });

    return Extension.create({
      name: "slash-commands",

      addOptions() {
        return {
          HTMLAttributes: { class: "commands" },
          suggestion: {
            char: "/",
            startOfLine: false,
            pluginKey: CommandsPluginKey,
            command: ({ editor, range, props }) => {
              props.command({ editor, range });
            },

            items: ({ query }) => {
              const filteredItems = commandItems.filter(({ title }) =>
                title.toLowerCase().includes(query.toLowerCase())
              );

              return isEmpty(filteredItems)
                ? [NO_RESULT_MENU_ITEM]
                : filteredItems;
            },

            render: () => {
              let reactRenderer;
              let popup;

              return {
                onStart: props => {
                  if (
                    props.editor.isActive("image") ||
                    props.editor.isActive("codeBlock")
                  ) {
                    return;
                  }

                  reactRenderer = new ReactRenderer(CommandsList, {
                    props,
                    editor: props.editor,
                  });

                  popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: reactRenderer.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                    arrow: false,
                    zIndex: 99999,
                    role: "dropdown",
                    theme: "light neeto-editor-slash-commands-tippy",
                  });

                  highlightFocussedNode();
                },
                onUpdate(props) {
                  if (
                    props.editor.isActive("image") ||
                    props.editor.isActive("codeBlock")
                  ) {
                    return;
                  }
                  reactRenderer?.updateProps(props);

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  });
                },
                onKeyDown(props) {
                  if (props.event.key === "Escape") {
                    popup[0].hide();

                    return true;
                  }

                  return reactRenderer && reactRenderer?.ref?.onKeyDown(props);
                },
                onExit() {
                  popup && popup[0].destroy();
                  reactRenderer && reactRenderer.destroy();
                  resetFocussedNode();
                },
              };
            },
          },
        };
      },

      addProseMirrorPlugins() {
        return [
          Suggestion({
            editor: this.editor,
            ...this.options.suggestion,
          }),
        ];
      },
    });
  },
};
