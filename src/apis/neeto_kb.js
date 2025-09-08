import axios from "axios";

import {
  NEETO_KB_ENDPOINT,
  NEETO_KB_ARTICLES_URL,
} from "../components/Editor/CustomExtensions/LinkKbArticles/constants";

const apiConfig = {
  baseURL: NEETO_KB_ENDPOINT,
  headers: { "X-Neeto-API-Key": "9099015ee520e11887eb" },
  transformResponseCase: false,
  transformRequestCase: false,
};

const fetchArticle = articleId =>
  axios.get(`${NEETO_KB_ARTICLES_URL}/${articleId}`, apiConfig);

const fetchArticles = params =>
  axios.get(NEETO_KB_ARTICLES_URL, { ...apiConfig, params });

const neetoKbApi = { fetchArticle, fetchArticles };

export default neetoKbApi;
