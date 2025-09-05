import React, { useState, useEffect, useRef } from "react";

import { isNotEmpty } from "neetocist";

import { decodeHtmlEntities } from "src/utils/common";
import { LeftArrow, Search as NeetoUISearchIcon } from "neetoicons";
import {
  Button as NeetoUIButton,
  Typography as NeetoUITypography,
  Spinner as NeetoUISpinner,
  Input as NeetoUIInput,
} from "neetoui";

import neetoKbApi from "src/apis/neeto_kb";

import { VIEWS } from "./constants";

const ArticleSelector = ({ editor, cursorPos, onClose }) => {
  const [currentView, setCurrentView] = useState(VIEWS.CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Data states
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);

  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  // Error states
  const [error, setError] = useState("");

  // Refs
  const modalRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    if (currentView === VIEWS.CATEGORIES) {
      fetchCategories();
    }
  }, [currentView]);

  // Fetch articles when category is selected or searching
  useEffect(() => {
    if (currentView === VIEWS.ARTICLES) {
      if (selectedCategory) {
        fetchArticlesByCategory(selectedCategory.id);
      } else {
        fetchAllArticles();
      }
    }
  }, [currentView, selectedCategory]);

  // Intelligent search logic - switches between categories and articles
  useEffect(() => {
    if (!searchTerm) {
      // No search term - show categories view
      if (currentView === VIEWS.ARTICLES && !selectedCategory) {
        setCurrentView(VIEWS.CATEGORIES);
      }

      return;
    }

    // Filter categories first (client-side)
    const matchingCategories = categories.filter(category =>
      category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isNotEmpty(matchingCategories)) {
      // Found matching categories - stay in categories view
      if (currentView === VIEWS.ARTICLES && !selectedCategory) {
        setCurrentView(VIEWS.CATEGORIES);
      }
    } else {
      // No categories match - automatically switch to article search
      setCurrentView(VIEWS.ARTICLES);
      setSelectedCategory(null);
      searchArticles(searchTerm);
    }
  }, [searchTerm, categories]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Position modal using CSS positioning instead of Tippy for simplicity
  useEffect(() => {
    if (modalRef.current && cursorPos) {
      modalRef.current.style.position = "fixed";
      modalRef.current.style.top = `${cursorPos.bottom + 8}px`;
      modalRef.current.style.left = `${cursorPos.left}px`;
      modalRef.current.style.zIndex = "99999";
    }
  }, [cursorPos]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setError("");
    try {
      const response = await neetoKbApi.fetchCategories();
      setCategories(response.categories || []);
    } catch {
      setError("Failed to load categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchAllArticles = async () => {
    setIsLoadingArticles(true);
    setError("");
    try {
      const response = await neetoKbApi.fetchArticles({});
      setArticles(response.articles || []);
    } catch {
      setError("Failed to load articles");
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const fetchArticlesByCategory = async categoryId => {
    setIsLoadingArticles(true);
    setError("");
    try {
      const response = await neetoKbApi.fetchArticlesByCategory(categoryId);
      setArticles(response.articles || []);
    } catch {
      setError("Failed to load articles");
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const searchArticles = async term => {
    setIsLoadingArticles(true);
    setError("");
    try {
      const response = await neetoKbApi.fetchArticles({ search_term: term });
      setArticles(response.articles || []);
    } catch {
      setError("Failed to search articles");
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setCurrentView(VIEWS.ARTICLES);
    setSearchTerm("");
  };

  const handleArticleSelect = async article => {
    try {
      // Fetch detailed article data to get full_url
      const response = await neetoKbApi.fetchArticle(article.id);
      const detailedArticle = response.article || response;

      if (detailedArticle.full_url) {
        // Get current selection from editor instead of using stored range
        const { from, to } = editor.state.selection;

        // Create link using TipTap's approach similar to LinkAddPopOver
        const linkText = detailedArticle.title || article.title;
        const attrs = {
          href: detailedArticle.full_url,
          "data-neeto-kb-article": "true",
          "data-article-id": article.id,
          title: detailedArticle.title || article.title,
        };

        const linkMark = editor.state.schema.marks.link.create(attrs);
        const linkTextWithMark = editor.state.schema.text(linkText, [linkMark]);

        const tr = editor.state.tr.replaceWith(from, to, linkTextWithMark);
        editor.view.dispatch(tr);
        editor.view.focus();
      } else {
        setError("Unable to create link - article URL not found");
      }
    } catch {
      setError("Failed to fetch article details");
    }

    onClose?.();
  };

  const handleBackToCategories = () => {
    setCurrentView(VIEWS.CATEGORIES);
    setSelectedCategory(null);
    setSearchTerm("");
  };

  // Filter categories based on search term
  const filteredCategories = searchTerm
    ? categories.filter(category =>
        category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  const isLoading = isLoadingCategories || isLoadingArticles;

  const renderCategoriesView = () => (
    <>
      <NeetoUITypography className="mb-3" style="h6" weight="semibold">
        {searchTerm
          ? `Categories matching "${searchTerm}"`
          : "Select a Category"}
      </NeetoUITypography>
      <div className="max-h-40 overflow-y-auto">
        {isNotEmpty(filteredCategories) ? (
          <div className="space-y-1">
            {filteredCategories.map(category => (
              <button
                className="hover:neeto-ui-bg-gray-100 focus:neeto-ui-bg-gray-100 neeto-ui-rounded w-full p-2 text-left focus:outline-none"
                key={category.id}
                onClick={() => handleCategorySelect(category)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {decodeHtmlEntities(category.name)}
                  </span>
                  <LeftArrow className="rotate-180" size={16} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="neeto-ui-text-gray-500 py-4 text-center">
            <NeetoUITypography style="body2">
              No categories found
            </NeetoUITypography>
          </div>
        )}
      </div>
    </>
  );

  const renderArticlesView = () => (
    <>
      <div className="mb-3 flex items-center">
        <NeetoUIButton
          className="mr-2"
          icon={LeftArrow}
          size="small"
          style="text"
          onClick={handleBackToCategories}
        />
        <NeetoUITypography style="h6" weight="semibold">
          {selectedCategory
            ? selectedCategory?.name
            : searchTerm
            ? `Articles matching "${searchTerm}"`
            : "All Articles"}
        </NeetoUITypography>
      </div>
      <div className="max-h-40 overflow-y-auto">
        {isNotEmpty(articles) ? (
          <div className="space-y-1">
            {articles.map(article => (
              <button
                className="hover:neeto-ui-bg-gray-100 focus:neeto-ui-bg-gray-100 neeto-ui-rounded w-full p-2 text-left focus:outline-none"
                key={article?.id}
                onClick={() => handleArticleSelect(article)}
              >
                <div className="neeto-ui-text-sm neeto-ui-font-medium">
                  {article?.title}
                </div>
                {article?.excerpt && (
                  <div className="neeto-ui-text-gray-500 mt-1 truncate text-xs">
                    {article?.excerpt}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="neeto-ui-text-gray-500 py-4 text-center">
            <NeetoUITypography style="body2">
              No articles found
            </NeetoUITypography>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className="neeto-ui-shadow-lg neeto-ui-rounded-lg neeto-ui-border-gray-200 neeto-ui-bg-white w-80 border p-4"
      ref={modalRef}
    >
      <div className="mb-4">
        <NeetoUIInput
          autoFocus
          unlimitedChars
          prefix={<NeetoUISearchIcon size={16} />}
          size="small"
          value={searchTerm}
          placeholder={
            currentView === VIEWS.CATEGORIES && !searchTerm
              ? "Search categories or articles..."
              : selectedCategory
              ? `Search articles in ${selectedCategory?.name}...`
              : "Search articles..."
          }
          onChange={({ target: { value } }) => setSearchTerm(value)}
        />
      </div>
      {error && (
        <div className="neeto-ui-rounded mb-4 border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <NeetoUISpinner />
        </div>
      ) : (
        <div>
          {currentView === VIEWS.CATEGORIES
            ? renderCategoriesView()
            : renderArticlesView()}
        </div>
      )}
    </div>
  );
};

export default ArticleSelector;
