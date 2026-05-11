import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";

export const CommandsPluginKey = new PluginKey("commands");

export default Extension.create({
  name: "commands",

  defaultOptions: {},

  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});
