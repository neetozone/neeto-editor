import { useState, useEffect, useCallback } from "react";

const useArticleNavigation = ({
  articles = [],
  articlesContainerRef,
  mode,
  onClose,
  handleModalArticleSelect,
  searchTerm,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [articles, searchTerm]);

  useEffect(() => {
    if (!articlesContainerRef?.current || !articles?.length) return;

    const container = articlesContainerRef.current;
    const highlightedItem = container.querySelector(
      `[data-index="${highlightedIndex}"]`
    );

    if (!highlightedItem) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = highlightedItem.getBoundingClientRect();

    const isItemAbove = itemRect.top < containerRect.top;
    const isItemBelow = itemRect.bottom > containerRect.bottom;

    if (isItemAbove) {
      container.scrollTop -= containerRect.top - itemRect.top;
    } else if (isItemBelow) {
      container.scrollTop += itemRect.bottom - containerRect.bottom;
    }
  }, [highlightedIndex, articles.length, articlesContainerRef]);

  const navigationHandlers = {
    down: prev => (prev < articles.length - 1 ? prev + 1 : 0),
    up: prev => (prev > 0 ? prev - 1 : articles.length - 1),
  };

  const keyActions = {
    Escape: () => onClose?.(),
    ArrowDown: () => setHighlightedIndex(navigationHandlers["down"]),
    ArrowUp: () => setHighlightedIndex(navigationHandlers["up"]),
    Tab: event =>
      setHighlightedIndex(navigationHandlers[event.shiftKey ? "up" : "down"]),
    Enter: () => {
      if (articles[highlightedIndex]) {
        handleModalArticleSelect?.(articles[highlightedIndex]);
      }
    },
  };

  const handleKeyboardNavigation = useCallback(
    event => {
      if (mode !== "modal") return;

      const action = keyActions[event.key];
      if (!action) return;

      event.preventDefault();
      action(event);
    },
    [mode, articles, highlightedIndex, onClose, handleModalArticleSelect]
  );

  useEffect(() => {
    if (mode !== "modal") return undefined;

    document.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      document.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [mode, handleKeyboardNavigation]);

  return { highlightedIndex };
};

export default useArticleNavigation;
