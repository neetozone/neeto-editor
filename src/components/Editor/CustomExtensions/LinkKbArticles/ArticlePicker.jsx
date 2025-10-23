import React, { useState, useEffect, useRef } from "react";

import { findBy } from "neetocist";
import Search from "neetomolecules/Search";
import { Select, Spinner as NeetoUISpinner } from "neetoui";
import { useTranslation } from "react-i18next";

import { useFetchKbArticles } from "hooks/reactQuery/kbArticle/useArticleFetching";

import ArticlesList from "./ArticlesList";
import {
  MODE,
  MODAL_BOTTOM_MARGIN,
  MODAL_LEFT_OFFSET,
  MODAL_TOP_OFFSET,
  MODAL_TRANSFORM_Y,
  MODAL_TRANSFORM_X,
} from "./constants";
import useArticleNavigation from "./hooks/useArticleNavigation";
import { buildArticleFullUrl, createArticleOptions } from "./utils";

const ArticlePicker = ({
  mode = MODE.MODAL,
  cursorPos,
  onClose,
  isLoading: externalIsLoading,
  options: externalOptions,
  value,
  onChange,
  placeholder,
  label,
  name,
  className,
  strategy,
  onArticleSelect,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef(null);
  const articlesContainerRef = useRef(null);

  const { data: articles = [], isLoading: isLoadingArticles } =
    useFetchKbArticles({
      searchTerm,
      reactQueryOptions: { enabled: !externalOptions },
    });

  const isLoading = externalIsLoading || isLoadingArticles;

  const selectOptions =
    mode === MODE.SELECT ? createArticleOptions(articles) : [];

  const handleModalArticleSelect = article => {
    if (mode !== MODE.MODAL || !article) return;

    const articleWithUrl = {
      ...article,
      full_url: buildArticleFullUrl(article.slug),
    };

    onArticleSelect(article, articleWithUrl);
    onClose?.();
  };

  const { highlightedIndex } = useArticleNavigation({
    articles,
    articlesContainerRef,
    mode,
    onClose,
    handleModalArticleSelect,
    searchTerm,
  });

  const handleSelectChange = (selectedValue, formikHelpers) => {
    const selectedOption = findBy(
      { value: selectedValue?.value },
      selectOptions
    );

    if (selectedOption?.data?.type === "article" && onChange) {
      onChange(selectedValue, formikHelpers);
    }
  };

  useEffect(() => {
    if (mode !== MODE.MODAL || !modalRef.current || !cursorPos) return;

    const modal = modalRef.current;

    const modalRect = modal.getBoundingClientRect();
    const modalWidth = modalRect.width || 320;
    const modalHeight = modalRect.height || 200;

    const maxLeft = window.innerWidth - modalWidth;
    const maxTop = window.innerHeight - modalHeight - MODAL_BOTTOM_MARGIN;

    const adjustedLeft = Math.min(cursorPos.left - MODAL_LEFT_OFFSET, maxLeft);
    const adjustedTop = Math.min(cursorPos.top - MODAL_TOP_OFFSET, maxTop);

    Object.assign(modal.style, {
      position: "fixed",
      top: `${adjustedTop}px`,
      left: `${adjustedLeft}px`,
      transform: `translateY(${MODAL_TRANSFORM_Y}px) translateX(${MODAL_TRANSFORM_X}px)`,
      zIndex: 99999,
    });
  }, [mode, cursorPos]);

  useEffect(() => {
    if (mode !== MODE.MODAL) return undefined;

    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mode, onClose]);

  if (mode === MODE.MODAL) {
    return (
      <div
        className="neeto-ui-shadow-lg neeto-ui-rounded-lg neeto-ui-border-gray-200 neeto-ui-bg-white w-80 border p-4"
        ref={modalRef}
      >
        <div className="mb-4">
          <Search
            autoFocus
            placeholder={t("neetoEditor.placeholders.searchArticles")}
            onSearch={setSearchTerm}
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <NeetoUISpinner />
          </div>
        ) : (
          <div>
            <ArticlesList
              {...{ articles, highlightedIndex, searchTerm }}
              containerRef={articlesContainerRef}
              onSelectArticle={handleModalArticleSelect}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <Select
      {...{ className, isLoading, label, name, placeholder, strategy, value }}
      isSearchable
      options={externalOptions || selectOptions}
      onChange={handleSelectChange}
    />
  );
};

export default ArticlePicker;
