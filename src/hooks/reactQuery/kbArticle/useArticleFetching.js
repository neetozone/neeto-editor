import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "hooks/constants/query";
import neetoKbApi from "src/apis/neeto_kb";

const useFetchKbArticles = ({
  searchTerm = "",
  reactQueryOptions = {},
} = {}) => {
  const queryParams = searchTerm ? { search_term: searchTerm } : {};

  return useQuery({
    queryKey: [QUERY_KEYS.KB_ARTICLES, queryParams],
    queryFn: async () => {
      const response = await neetoKbApi.fetchArticles(queryParams);

      return response.articles || response.data?.articles || [];
    },
    ...reactQueryOptions,
  });
};

export { useFetchKbArticles };
