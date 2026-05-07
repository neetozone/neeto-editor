import { URL_VALIDATORS } from "common/constants";

export const validateUrl = url => {
  if (!url) return false;

  for (const validator of Object.values(URL_VALIDATORS)) {
    const result = validator(url);
    if (result) return result;
  }

  return false;
};
