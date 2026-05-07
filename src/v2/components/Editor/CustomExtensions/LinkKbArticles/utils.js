import { decodeHtmlEntities } from "src/utils/common";

import { NEETO_KB_ENDPOINT } from "./constants";

export const buildArticleFullUrl = slug =>
  slug ? `${NEETO_KB_ENDPOINT}/articles/${slug}` : null;

export const createArticleOptions = articles =>
  articles.map(article => ({
    label: decodeHtmlEntities(article.title),
    value: article.id,
    data: { type: "article", ...article },
  }));

export const extractKbArticleIds = editor => {
  if (!editor) return [];

  const articleIds = [];
  const { doc } = editor.state;

  doc.descendants(node => {
    if (node.marks) {
      node.marks.forEach(mark => {
        if (
          mark.type.name === "link" &&
          mark.attrs["data-neeto-kb-article"] === "true" &&
          mark.attrs["data-article-id"]
        ) {
          articleIds.push(mark.attrs["data-article-id"]);
        }
      });
    }
  });

  return [...new Set(articleIds)];
};
