import { useState, useEffect } from "react";

import { isEmpty, pluck } from "ramda";

import { extractKbArticleIds } from "src/components/Editor/CustomExtensions/LinkKbArticles/utils";

import { useFetchKbArticles } from "./useArticleFetching";

export const useDeletedArticles = editor => {
  const [deletedArticleIds, setDeletedArticleIds] = useState(new Set());

  const { data: allArticles = [], isLoading: isCheckingDeleted } =
    useFetchKbArticles({ searchTerm: "" });

  const checkAllArticles = () => {
    const articleIdsInEditor = extractKbArticleIds(editor);
    if (isEmpty(articleIdsInEditor)) {
      setDeletedArticleIds(new Set());

      return;
    }

    const existingArticleIds = new Set(pluck("id", allArticles));

    const deletedIds = new Set(
      articleIdsInEditor.filter(id => !existingArticleIds.has(id))
    );

    setDeletedArticleIds(deletedIds);
  };

  useEffect(() => {
    if (!editor || isEmpty(allArticles)) return;

    checkAllArticles();
  }, [allArticles]);

  return {
    deletedArticleIds,
    isCheckingDeleted,
    isArticleDeleted: deletedArticleIds.has.bind(deletedArticleIds),
    checkAllArticles,
  };
};
