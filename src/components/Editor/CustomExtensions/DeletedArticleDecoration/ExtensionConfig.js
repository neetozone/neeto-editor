import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const DeletedArticleDecoration = Extension.create({
  name: "deletedArticleDecoration",

  addOptions() {
    return { deletedArticleIds: new Set() };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("deletedArticleDecoration"),
        props: {
          decorations: ({ doc }) => {
            const decorations = [];

            doc.descendants((node, pos) => {
              if (!node.marks) return;

              node.marks.forEach(mark => {
                if (
                  !(
                    mark.type.name === "link" &&
                    mark.attrs["data-neeto-kb-article"] === "true" &&
                    mark.attrs["data-article-id"]
                  )
                ) {
                  return;
                }

                const articleId = mark.attrs["data-article-id"];
                if (!this.options.deletedArticleIds.has(articleId)) return;

                const decoration = Decoration.inline(pos, pos + node.nodeSize, {
                  "data-article-deleted": "true",
                  class: "neeto-kb-article-deleted",
                });
                decorations.push(decoration);
              });
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      updateDeletedArticles: deletedArticleIds => () => {
        this.options.deletedArticleIds = deletedArticleIds;
        this.editor.view.updateState(this.editor.state);

        return true;
      },
    };
  },
});

export default DeletedArticleDecoration;
