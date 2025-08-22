import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { t } from "i18next";

const Placeholder = Extension.create({
  name: "placeholder",

  addOptions() {
    return {
      excludeNodeTypes: ["variable", "codeBlock"],
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      placeholder: t("neetoEditor.placeholders.writeSomething"),
      slashCommandsPlaceholder: t(
        "neetoEditor.placeholders.writeSlashForCommands"
      ),
      showOnlyWhenEditable: true,
      showOnlyCurrent: false,
      includeChildren: false,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }) => {
            const active =
              this.editor.isEditable || !this.options.showOnlyWhenEditable;
            const { anchor } = selection;
            const decorations = [];

            if (!active) {
              return null;
            }

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
              const isEmpty = !node.isLeaf && !node.childCount;

              const isExcluded = this.options.excludeNodeTypes.includes(
                node.type.name
              );

              if (
                (hasAnchor || !this.options.showOnlyCurrent) &&
                !isExcluded &&
                isEmpty
              ) {
                const classes = [this.options.emptyNodeClass];

                let placeholderText = this.options.placeholder;

                if (this.editor.isEmpty) {
                  classes.push(this.options.emptyEditorClass);

                  if (
                    this.options.isSlashCommandsActive &&
                    !this.options.placeholder
                  ) {
                    placeholderText = this.options.slashCommandsPlaceholder;
                  }
                }

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(" "),
                  "data-placeholder": placeholderText,
                });
                decorations.push(decoration);
              }

              return this.options.includeChildren;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default Placeholder;
