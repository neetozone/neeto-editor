import React from "react";

import { Typography } from "@bigbinary/neeto-atoms";
import classNames from "classnames";
import { isNotEmpty } from "neetocist";
import { withT } from "neetocommons/v2/react-utils";

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
                "w-full rounded p-2 text-left hover:bg-gray-200 focus:bg-gray-200 focus:outline-none",
                { "bg-gray-200": index === highlightedIndex }
              )}
              onClick={() => onSelectArticle?.(article)}
            >
              <div className="text-sm font-medium">
                {decodeHtmlEntities(article?.title)}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-gray-500">
          <Typography variant="body2">
            {t("neetoEditor.error.noResults")}
          </Typography>
        </div>
      )}
    </div>
  )
);

export default ArticlesList;
