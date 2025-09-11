import Fuse from "fuse.js";
import { isEmpty, pluck } from "ramda";

import { DEFAULT_SEARCH_KEYS, FUZZY_SEARCH } from "./constants";

export const fuzzySearch = (items, query, options = {}) => {
  const {
    limit = FUZZY_SEARCH.LIMIT,
    threshold = FUZZY_SEARCH.THRESHOLD,
    distance = FUZZY_SEARCH.DISTANCE,
    keys = DEFAULT_SEARCH_KEYS,
    includeMatches = false,
  } = options;

  if (!query || !items || isEmpty(items)) {
    return items ? items.slice(0, limit) : [];
  }

  const fuseOptions = {
    keys,
    threshold,
    distance,
    includeScore: true,
    shouldSort: true,
    includeMatches,
    ignoreLocation: true,
    minMatchCharLength: 1,
    findAllMatches: false,
    ignoreFieldNorm: false,
  };

  const fuse = new Fuse(items, fuseOptions);
  const results = fuse.search(query, { limit });

  return pluck("item", results);
};

export default fuzzySearch;
