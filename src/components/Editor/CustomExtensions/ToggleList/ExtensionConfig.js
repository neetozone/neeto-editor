import {
  Details,
  DetailsContent,
  DetailsSummary,
} from "@tiptap/extension-details";
import Placeholder from "@tiptap/extension-placeholder";
import { t } from "i18next";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";

export const ToggleList = Details.configure({
  persist: true,
  HTMLAttributes: { class: "neeto-editor-toggle-list" },
  openClassName: "is-open",
}).extend({
  addCommands() {
    return {
      ...this.parent?.(),
      setToggleList:
        () =>
        ({ tr, state, dispatch, chain, editor }) => {
          if (editor.isActive("details")) {
            return chain().focus().unsetDetails().run();
          }

          const { selection } = state;
          const { from, to, $from } = selection;

          const selectedText = state.doc.textBetween(from, to, "");

          let textToUse = selectedText.trim();
          let rangeFrom = from;
          let rangeTo = to;

          if (!textToUse) {
            const currentNode = $from.parent;
            if (
              currentNode.type.name === "paragraph" &&
              currentNode.textContent.trim()
            ) {
              textToUse = currentNode.textContent.trim();
              rangeFrom = $from.before($from.depth);
              rangeTo = $from.after($from.depth);
            }
          }

          if (textToUse) {
            const detailsNode = state.schema.nodes.details.create({}, [
              state.schema.nodes.detailsSummary.create(
                {},
                state.schema.text(textToUse)
              ),
              state.schema.nodes.detailsContent.create(
                {},
                state.schema.nodes.paragraph.create()
              ),
            ]);

            const newTr = tr.replaceWith(rangeFrom, rangeTo, detailsNode);

            const insertPos = rangeFrom + detailsNode.nodeSize;
            if (insertPos >= newTr.doc.content.size) {
              newTr.insert(insertPos, state.schema.nodes.paragraph.create());
            }

            if (dispatch) {
              dispatch(newTr);
            }

            return true;
          }

          return chain()
            .setDetails()
            .command(({ tr, state, dispatch }) => {
              const docSize = tr.doc.content.size;
              const lastNode = tr.doc.lastChild;

              if (lastNode?.type.name === "details") {
                tr.insert(docSize, state.schema.nodes.paragraph.create());
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

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      new Plugin({
        key: new PluginKey("focusToggleContentOnOpen"),
        appendTransaction: (transactions, oldState, newState) => {
          if (!transactions.some(tr => tr.docChanged)) {
            return null;
          }

          let focusPosition = null;

          newState.doc.descendants((node, pos) => {
            if (focusPosition !== null) {
              return false;
            }

            if (node.type.name !== this.name) {
              return true;
            }

            if (node.attrs.open) {
              const oldNode = oldState.doc.nodeAt(pos);
              if (oldNode && !oldNode.attrs.open) {
                const summaryNode = node.firstChild;
                const contentNode = node.child(1);

                if (!summaryNode || !contentNode) return true;

                const isContentEmpty =
                  contentNode.childCount === 1 &&
                  contentNode.firstChild?.type.name === "paragraph" &&
                  contentNode.firstChild?.content.size === 0;

                const contentStartPos = pos + 1 + summaryNode.nodeSize;

                if (isContentEmpty) {
                  focusPosition = contentStartPos + 2;
                } else {
                  focusPosition = contentStartPos + contentNode.nodeSize - 1;
                }
              }
            }

            return true;
          });

          if (focusPosition !== null) {
            return newState.tr.setSelection(
              TextSelection.create(newState.doc, focusPosition)
            );
          }

          return null;
        },
      }),
    ];
  },
});

export const ToggleListSummary = DetailsSummary;
export const ToggleListContent = DetailsContent;
export const ToggleListPlaceholder = Placeholder.configure({
  includeChildren: true,
  placeholder: ({ node }) => {
    if (node.type.name === "detailsSummary") {
      return t("neetoEditor.placeholders.toggleSummary");
    }

    return "";
  },
});

export default ToggleList;
