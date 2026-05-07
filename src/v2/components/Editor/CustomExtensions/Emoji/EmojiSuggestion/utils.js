import { DEFAULT_EMOJI_PRIORITIES_LIST } from "./constants";

export const filterEmojiSuggestions = (suggestions, frequentlyUsedEmojis) => {
  const mergedEmojiList = DEFAULT_EMOJI_PRIORITIES_LIST.concat(
    frequentlyUsedEmojis.filter(
      emoji => !DEFAULT_EMOJI_PRIORITIES_LIST.includes(emoji)
    )
  );

  return suggestions
    .sort((a, b) => {
      const aIndex = mergedEmojiList.indexOf(a.id);
      const bIndex = mergedEmojiList.indexOf(b.id);
      if (aIndex === -1 && bIndex === -1) {
        return 0;
      } else if (aIndex === -1) {
        return 1;
      } else if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    })
    .slice(0, 5);
};
