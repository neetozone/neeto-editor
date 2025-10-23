import React from "react";

import classNames from "classnames";
import { isNotEmpty } from "neetocist";
import { withT } from "neetocommons/react-utils";
import { Typography as NeetoUITypography } from "neetoui";

import { decodeHtmlEntities } from "src/utils/common";

const ArticlesList = withT(
  ({
    t,
    articles = [],
    onSelectArticle,
    highlightedIndex = 0,
    containerRef,
  }) => (
    <div className="max-h-40 overflow-y-auto" ref={containerRef}>
      {isNotEmpty(articles) ? (
        <div className="space-y-1">
          {articles.map((article, index) => (
            <button
              data-index={index}
              key={article?.id}
              className={classNames(
                "hover:neeto-ui-bg-gray-200 focus:neeto-ui-bg-gray-200 neeto-ui-rounded w-full p-2 text-left focus:outline-none",
                { "neeto-ui-bg-gray-200": index === highlightedIndex }
              )}
              onClick={() => onSelectArticle?.(article)}
            >
              <div className="neeto-ui-text-sm neeto-ui-font-medium">
                {decodeHtmlEntities(article?.title)}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="neeto-ui-text-gray-500 py-4 text-center">
          <NeetoUITypography style="body2">
            {t("neetoEditor.error.noResults")}
          </NeetoUITypography>
        </div>
      )}
    </div>
  )
);

export default ArticlesList;
