import { isEmpty, isNil, pluck, prop } from "ramda";

import { DEFAULT_SEARCH_KEYS, FUZZY_SEARCH } from "./constants";

const calculateScore = (input, target) => {
  const inputLower = input.toLowerCase();
  const targetLower = target.toLowerCase();

  const substringIndex = targetLower.indexOf(inputLower);
  if (substringIndex !== -1) {
    return 1.0 - (substringIndex / targetLower.length) * 0.1;
  }

  let inputIndex = 0;
  let targetIndex = 0;
  let firstMatchIndex = -1;
  let consecutiveMatches = 0;
  let maxConsecutive = 0;

  while (inputIndex < inputLower.length && targetIndex < targetLower.length) {
    if (inputLower[inputIndex] === targetLower[targetIndex]) {
      if (firstMatchIndex === -1) {
        firstMatchIndex = targetIndex;
      }
      consecutiveMatches++;
      inputIndex++;
    } else {
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
      consecutiveMatches = 0;
    }
    targetIndex++;
  }
  maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);

  if (inputIndex < inputLower.length) {
    return 0;
  }

  const positionScore = 1.0 - firstMatchIndex / targetLower.length;
  const consecutiveBonus = maxConsecutive / inputLower.length;
  const lengthRatio = inputLower.length / targetLower.length;

  const score =
    positionScore * 0.6 + consecutiveBonus * 0.2 + lengthRatio * 0.2;

  return Math.min(score, 0.89);
};

export const fuzzySearch = (items, query, options = {}) => {
  const { limit = FUZZY_SEARCH.LIMIT, keys = DEFAULT_SEARCH_KEYS } = options;

  if (!query || typeof query !== "string" || !items || isEmpty(items)) {
    return items ? items.slice(0, limit) : [];
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return items ? items.slice(0, limit) : [];
  }

  const fieldAccessors = keys.map(key => ({
    getValue: typeof key === "string" ? prop(key) : prop(key.name),
    weight: typeof key === "string" ? 1 : key.weight || 1,
  }));

  const results = items.reduce((acc, item) => {
    const bestScore = fieldAccessors.reduce((maxScore, accessor) => {
      const fieldValue = accessor.getValue(item);
      if (isNil(fieldValue)) return maxScore;

      const fieldString = String(fieldValue);
      const score = calculateScore(trimmedQuery, fieldString);
      if (score <= 0) return maxScore;

      const weightedScore = score * accessor.weight;

      return weightedScore > maxScore ? weightedScore : maxScore;
    }, 0);

    if (bestScore > 0) {
      acc.push({ item, score: bestScore });
    }

    return acc;
  }, []);

  results.sort((a, b) => {
    if (Math.abs(a.score - b.score) < 0.001) {
      const aTitle = a.item.title || a.item.name || "";
      const bTitle = b.item.title || b.item.name || "";

      return aTitle.localeCompare(bTitle);
    }

    return b.score - a.score;
  });

  return pluck("item", results.slice(0, limit));
};
