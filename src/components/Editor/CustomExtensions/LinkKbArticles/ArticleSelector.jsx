import React, { useState, useEffect, useRef } from "react";

import Search from "neetomolecules/Search";
import { Spinner as NeetoUISpinner } from "neetoui";
import { useTranslation } from "react-i18next";

import neetoKbApi from "src/apis/neeto_kb";

import ArticlesList from "./ArticlesList";

const ArticleSelector = ({ editor, cursorPos, onClose }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const [articles, setArticles] = useState([]);

  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!(modalRef.current && cursorPos)) return;
    modalRef.current.style.position = "fixed";
    modalRef.current.style.top = `${cursorPos.bottom + 8}px`;
    modalRef.current.style.left = `${cursorPos.left}px`;
    modalRef.current.style.zIndex = "99999";
  }, [cursorPos]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const fetchArticles = async (searchTerm = "") => {
    setIsLoadingArticles(true);

    const params = searchTerm ? { search_term: searchTerm } : {};
    const response = await neetoKbApi.fetchArticles(params);
    setArticles(response.articles || []);

    setIsLoadingArticles(false);
  };

  const handleArticleSelect = async article => {
    const response = await neetoKbApi.fetchArticle(article.id);
    const detailedArticle = response.article || response;

    if (detailedArticle.full_url) {
      const { from, to } = editor.state.selection;

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
    }

    onClose?.();
  };

  const isLoading = isLoadingArticles;

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
            onSelectArticle={handleArticleSelect}
          />
        </div>
      )}
    </div>
  );
};

export default ArticleSelector;
