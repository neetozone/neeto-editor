import Fuse from "fuse.js";
import { isEmpty, pluck } from "ramda";

import { DEFAULT_SEARCH_KEYS } from "./constants";

export const fuzzySearch = (items, query, options = {}) => {
  const {
    limit = 10,
    threshold = 0.4,
    distance = 100,
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
  const results = fuse.search(query);

  return pluck("item", results).slice(0, limit);
};

export default fuzzySearch;
