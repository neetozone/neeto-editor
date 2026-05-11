import Document from "@tiptap/extension-document";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export default Document.extend({
  name: "selectionDecorator",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("selectionDecorator"),
        state: {
          init() {
            return {
              decorations: DecorationSet.empty,
              selectedTextDecoration: null,
            };
          },
          apply(tr, oldState) {
            const { doc, selection } = tr;
            let { decorations, selectedTextDecoration } = oldState;

            if (selectedTextDecoration) {
              decorations = decorations.remove([selectedTextDecoration]);
            }

            if (!selection.empty) {
              selectedTextDecoration = Decoration.inline(
                selection.from,
                selection.to,
                { class: "selected-text" }
              );
              decorations = decorations.add(doc, [selectedTextDecoration]);
            } else {
              selectedTextDecoration = null;
            }

            return { decorations, selectedTextDecoration };
          },
        },
        props: {
          decorations(state) {
            return this.getState(state).decorations;
          },
        },
      }),
    ];
  },
});
