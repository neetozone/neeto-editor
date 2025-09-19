import React from "react";

import ArticlePicker from "./ArticlePicker";

const ArticleSelector = ({
  editor,
  cursorPos,
  onClose,
  deletedArticlesHook,
}) => {
  const handleArticleSelect = (article, detailedArticle) => {
    if (!detailedArticle.full_url) return;
    const { from, to } = editor.state.selection;

    const linkText = detailedArticle.title || article.title;
    const isDeleted = deletedArticlesHook?.isArticleDeleted(article.id);

    const attrs = {
      href: detailedArticle.full_url,
      "data-neeto-kb-article": "true",
      "data-article-id": article.id,
      "data-article-deleted": isDeleted ? "true" : null,
      title: detailedArticle.title || article.title,
    };

    const linkMark = editor.state.schema.marks.link.create(attrs);
    const linkTextWithMark = editor.state.schema.text(linkText, [linkMark]);

    const tr = editor.state.tr.replaceWith(from, to, linkTextWithMark);
    editor.view.dispatch(tr);
    editor.view.focus();
  };

  return (
    <ArticlePicker
      {...{ cursorPos, deletedArticlesHook, editor, onClose }}
      mode="modal"
      onArticleSelect={handleArticleSelect}
    />
  );
};

export default ArticleSelector;
