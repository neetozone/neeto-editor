import { useState, useEffect, useCallback } from "react";

import neetoKbApi from "src/apis/neeto_kb";

export const useDeletedArticles = editor => {
  const [deletedArticleIds, setDeletedArticleIds] = useState(new Set());
  const [isCheckingDeleted, setIsCheckingDeleted] = useState(false);

  // Extract all KB article IDs from the editor content
  const extractKbArticleIds = useCallback(() => {
    if (!editor) return [];

    const articleIds = [];
    const { doc } = editor.state;

    doc.descendants(node => {
      if (node.marks) {
        node.marks.forEach(mark => {
          if (
            mark.type.name === "link" &&
            mark.attrs["data-neeto-kb-article"] === "true" &&
            mark.attrs["data-article-id"]
          ) {
            articleIds.push(mark.attrs["data-article-id"]);
          }
        });
      }
    });

    return [...new Set(articleIds)]; // Remove duplicates
  }, [editor]);

  // Check if a single article exists
  const checkArticleExists = useCallback(async articleId => {
    try {
      await neetoKbApi.fetchArticle(articleId);

      return true;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }

      return null;
    }
  }, []);

  // Check all KB articles in the editor
  const checkAllArticles = useCallback(async () => {
    const articleIds = extractKbArticleIds();
    if (articleIds.length === 0) return;

    setIsCheckingDeleted(true);
    const newDeletedIds = new Set();

    const checks = articleIds.map(async id => {
      const exists = await checkArticleExists(id);
      if (!exists) {
        newDeletedIds.add(id);
      }
    });

    await Promise.all(checks);
    setDeletedArticleIds(newDeletedIds);
    setIsCheckingDeleted(false);
  }, [extractKbArticleIds, checkArticleExists]);

  // Check articles when editor content changes (debounced)
  useEffect(() => {
    if (!editor) return;

    const timeoutId = setTimeout(() => {
      checkAllArticles();
    }, 1000);

    () => clearTimeout(timeoutId);
  }, [editor?.state.doc, checkAllArticles]);

  // Check a specific article (for real-time validation)
  const checkSingleArticle = useCallback(
    async articleId => {
      const exists = await checkArticleExists(articleId);

      setDeletedArticleIds(prev => {
        const newSet = new Set(prev);
        if (exists) {
          newSet.delete(articleId);
        } else {
          newSet.add(articleId);
        }

        return newSet;
      });

      return exists;
    },
    [checkArticleExists]
  );

  return {
    deletedArticleIds,
    isCheckingDeleted,
    isArticleDeleted: articleId => deletedArticleIds.has(articleId),
    checkSingleArticle,
    checkAllArticles,
  };
};
