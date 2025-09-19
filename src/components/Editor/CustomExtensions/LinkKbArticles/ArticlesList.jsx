import React from "react";

import { isNotEmpty } from "neetocist";
import { withT } from "neetocommons/react-utils";
import { Typography as NeetoUITypography } from "neetoui";
import { Trans } from "react-i18next";

import { decodeHtmlEntities } from "src/utils/common";

const ArticlesList = withT(
  ({ t, articles = [], searchTerm = "", onSelectArticle }) => (
    <>
      <NeetoUITypography className="mb-3" style="h6" weight="semibold">
        {searchTerm ? (
          <Trans
            i18nKey="neetoEditor.linkKb.articlesMatching"
            values={{ entity: searchTerm }}
          />
        ) : (
          t("neetoEditor.linkKb.selectArticle")
        )}
      </NeetoUITypography>
      <div className="max-h-40 overflow-y-auto">
        {isNotEmpty(articles) ? (
          <div className="space-y-1">
            {articles.map(article => (
              <button
                className="hover:neeto-ui-bg-gray-100 focus:neeto-ui-bg-gray-100 neeto-ui-rounded w-full p-2 text-left focus:outline-none"
                key={article?.id}
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
    </>
  )
);

export default ArticlesList;
