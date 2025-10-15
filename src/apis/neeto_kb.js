import axios from "axios";
import { globalProps } from "neetocommons/initializers";

import {
  NEETO_KB_ENDPOINT,
  NEETO_KB_ARTICLES_URL,
} from "../components/Editor/CustomExtensions/LinkKbArticles/constants";

const apiConfig = {
  baseURL: NEETO_KB_ENDPOINT,
  headers: { "X-Neeto-API-Key": globalProps?.organization?.apiKey },
  transformResponseCase: false,
  transformRequestCase: false,
};

const fetchArticles = params =>
  axios.get(NEETO_KB_ARTICLES_URL, { ...apiConfig, params });

const neetoKbApi = { fetchArticles };

export default neetoKbApi;
