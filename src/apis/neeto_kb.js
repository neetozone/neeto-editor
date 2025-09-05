import axios from "axios";

import {
  NEETO_KB_ENDPOINT,
  NEETO_KB_ARTICLES_URL,
  NEETO_KB_CATEGORIES_URL,
} from "../constants";

const apiConfig = {
  baseURL: NEETO_KB_ENDPOINT,
  headers: { "X-Neeto-API-Key": "9099015ee520e11887eb" },
  transformResponseCase: false,
  transformRequestCase: false,
};

const fetchArticlesByCategory = categoryId =>
  axios.get(NEETO_KB_ARTICLES_URL, {
    ...apiConfig,
    params: { category_id: categoryId },
  });

const fetchArticle = articleId =>
  axios.get(`${NEETO_KB_ARTICLES_URL}/${articleId}`, apiConfig);

const fetchCategories = () => axios.get(NEETO_KB_CATEGORIES_URL, apiConfig);

const fetchArticles = params =>
  axios.get(NEETO_KB_ARTICLES_URL, { ...apiConfig, params });

const neetoKbApi = {
  fetchArticle,
  fetchArticles,
  fetchArticlesByCategory,
  fetchCategories,
};

export default neetoKbApi;
