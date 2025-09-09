import { useState, useCallback } from "react";

import neetoKbApi from "src/apis/neeto_kb";
import { decodeHtmlEntities } from "src/utils/common";

export const useArticleFetching = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchArticles = useCallback(async (searchTerm = "") => {
    setIsLoading(true);

    try {
      const params = searchTerm ? { search_term: searchTerm } : {};
      const response = await neetoKbApi.fetchArticles(params);

      return response.articles || response.data?.articles || [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchArticleDetails = useCallback(async articleId => {
    const response = await neetoKbApi.fetchArticle(articleId);

    return response.article || response.data?.article || response;
  }, []);

  const createArticleOptions = useCallback(
    articles =>
      articles.map(article => ({
        label: decodeHtmlEntities(article.title),
        value: article.id,
        data: { type: "article", ...article },
      })),
    []
  );

  return {
    isLoading,
    fetchArticles,
    fetchArticleDetails,
    createArticleOptions,
  };
};
