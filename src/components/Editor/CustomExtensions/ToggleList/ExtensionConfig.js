import { findParentNode } from "@tiptap/core";
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
          transactions.forEach(tr => {
            tr.steps.forEach(step => {
              step.getMap().forEach((_oldStart, _oldEnd, newStart, newEnd) => {
                newState.doc.nodesBetween(
                  newStart,
                  newEnd,
                  (newNode, newPos) => {
                    if (
                      !(newNode.type.name === this.name && newNode.attrs.open)
                    ) {
                      return;
                    }

                    const oldNode = oldState.doc.nodeAt(
                      tr.mapping.invert().map(newPos)
                    );
                    if (oldNode && !oldNode.attrs.open) {
                      const summaryNode = newNode.firstChild;
                      const contentNode = newNode.child(1);
                      if (!summaryNode || !contentNode) return;

                      const isContentEmpty =
                        contentNode.childCount === 1 &&
                        contentNode.firstChild?.type.name === "paragraph" &&
                        contentNode.firstChild?.content.size === 0;

                      const contentStartPos = newPos + 1 + summaryNode.nodeSize;

                      if (isContentEmpty) {
                        focusPosition = contentStartPos + 2;
                      } else {
                        focusPosition =
                          contentStartPos + contentNode.nodeSize - 1;
                      }
                    }
                  }
                );
              });
            });
          });

          if (focusPosition !== null) {
            return newState.tr.setSelection(
              TextSelection.create(newState.doc, focusPosition)
            );
          }

          return null;
        },
      }),

      new Plugin({
        key: new PluginKey("detailsClickSync"),
        props: {
          handleDOMEvents: {
            mousedown(view, event) {
              const target = event.target;
              if (!target || !(target instanceof Element)) return false;

              const details = target.closest(".neeto-editor-toggle-list");

              if (details && target.closest("summary") === details.firstChild) {
                requestAnimationFrame(() => {
                  const pos = view.posAtDOM(details, 0);
                  const node = view.state.doc.nodeAt(pos);

                  const isOpenInDOM = details.hasAttribute("open");

                  if (node && node.attrs.open !== isOpenInDOM) {
                    const tr = view.state.tr.setNodeAttribute(
                      pos,
                      "open",
                      isOpenInDOM
                    );
                    view.dispatch(tr);
                  }
                });
              }

              return false;
            },
          },
        },
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),

      Enter: () => {
        const { editor } = this;
        const { state } = editor;
        if (!editor.view.endOfTextblock("forward", state)) return false;
        const parentDetails = findParentNode(
          node => node.type.name === this.name
        )(state.selection);
        if (!parentDetails) return false;

        if (state.selection.$from.parent.type.name !== "detailsSummary") {
          return false;
        }
        const { node: detailsNode, pos: detailsPos } = parentDetails;
        const posAfterDetails = detailsPos + detailsNode.nodeSize;

        return editor
          .chain()
          .insertContentAt(posAfterDetails, {
            type: this.name,
            content: [
              { type: "detailsSummary", content: [] },
              { type: "detailsContent", content: [{ type: "paragraph" }] },
            ],
          })
          .setTextSelection(posAfterDetails + 2)
          .run();
      },

      Backspace: () => {
        const { editor } = this;
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parentOffset > 0) {
          return false;
        }

        const parentDetails = findParentNode(
          node => node.type.name === this.name
        )(selection);

        if (!parentDetails) {
          return false;
        }

        if (parentDetails.node.firstChild !== $from.parent) {
          return false;
        }

        if ($from.parent.content.size > 0) {
          return false;
        }

        const from = parentDetails.pos;
        const to = from + parentDetails.node.nodeSize;

        return editor
          .chain()
          .command(({ tr, dispatch }) => {
            if (dispatch) {
              const paragraph = state.schema.nodes.paragraph.create();
              tr.replaceWith(from, to, paragraph);
              tr.setSelection(TextSelection.create(tr.doc, from + 1));
            }

            return true;
          })
          .run();
      },
    };
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
