import React, { useState, useEffect, useRef } from "react";

import { findBy } from "neetocist";
import Search from "neetomolecules/Search";
import { Select, Spinner as NeetoUISpinner } from "neetoui";
import { useTranslation } from "react-i18next";

import { useArticleFetching } from "hooks/useArticleFetching";

import ArticlesList from "./ArticlesList";

const ArticlePicker = ({
  mode = "modal",
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
  onArticleSelect, // For modal mode
}) => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectOptions, setSelectOptions] = useState([]);
  const modalRef = useRef(null);

  const {
    isLoading: internalIsLoading,
    fetchArticles: fetchArticlesData,
    fetchArticleDetails,
    createArticleOptions,
  } = useArticleFetching();

  const isLoading =
    mode === "select"
      ? externalIsLoading ?? internalIsLoading
      : internalIsLoading;

  const fetchArticles = async (searchTerm = "") => {
    const articlesData = await fetchArticlesData(searchTerm);

    if (mode === "modal") {
      setArticles(articlesData);
    } else if (mode === "select") {
      const articleOptions = createArticleOptions(articlesData);
      setSelectOptions(articleOptions);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleModalArticleSelect = async article => {
    if (onArticleSelect) {
      const detailedArticle = await fetchArticleDetails(article.id);
      onArticleSelect(article, detailedArticle);
    }
    onClose?.();
  };

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
    if (mode !== "modal" || !modalRef.current || !cursorPos) return;

    modalRef.current.style.position = "fixed";
    modalRef.current.style.top = `${cursorPos.bottom + 8}px`;
    modalRef.current.style.left = `${cursorPos.left}px`;
    modalRef.current.style.zIndex = "99999";
  }, [mode, cursorPos]);

  useEffect(() => {
    if (mode !== "modal") return;

    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mode, onClose]);

  if (mode === "modal") {
    return (
      <div
        className="neeto-ui-shadow-lg neeto-ui-rounded-lg neeto-ui-border-gray-200 neeto-ui-bg-white w-80 border p-4"
        ref={modalRef}
      >
        <div className="mb-4">
          <Search
            autoFocus
            debounceTime={300}
            placeholder={t("neetoEditor.placeholders.searchArticles")}
            value={searchTerm}
            onChange={({ target: { value } }) => setSearchTerm(value)}
            onSearch={fetchArticles}
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <NeetoUISpinner />
          </div>
        ) : (
          <div>
            <ArticlesList
              {...{ articles, searchTerm }}
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
