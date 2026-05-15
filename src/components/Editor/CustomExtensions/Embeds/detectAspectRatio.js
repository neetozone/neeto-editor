// CORS verified for the three oEmbed providers we use as of 2026-05:
// YouTube reflects the request Origin; Vimeo and Loom return `*`. Browser
// `fetch` works without a proxy. Re-verify if a new provider is added.
import {
  YOUTUBE_URL_REGEXP,
  VIMEO_URL_REGEXP,
  LOOM_URL_REGEXP,
  NEETO_RECORD_URL_REGEXP,
  NEETO_RECORD_CUSTOM_DOMAIN_URL_REGEXP,
  SUPA_DEMO_URL_REGEXP,
} from "src/common/constants";

import {
  MAX_EMBED_WIDTH,
  DEFAULT_EMBED_DIMENSIONS,
  EMBED_PROVIDER_FALLBACK,
  EMBED_OEMBED_ENDPOINT,
} from "./constants";

const getProvider = url => {
  if (YOUTUBE_URL_REGEXP.test(url)) return "youtube";

  if (VIMEO_URL_REGEXP.test(url)) return "vimeo";

  if (LOOM_URL_REGEXP.test(url)) return "loom";

  if (NEETO_RECORD_URL_REGEXP.test(url)) return "neetoRecord";

  if (NEETO_RECORD_CUSTOM_DOMAIN_URL_REGEXP.test(url)) {
    return "neetoRecordCustom";
  }

  if (SUPA_DEMO_URL_REGEXP.test(url)) return "supademo";

  return null;
};

const scaleToMaxWidth = ({ width, height }) => {
  if (!width || !height) return DEFAULT_EMBED_DIMENSIONS;

  if (width <= MAX_EMBED_WIDTH) {
    return { width: Math.round(width), height: Math.round(height) };
  }

  const scaledHeight = Math.round((MAX_EMBED_WIDTH * height) / width);

  return { width: MAX_EMBED_WIDTH, height: scaledHeight };
};

const cache = new Map();

const fetchOembedDimensions = async (provider, url) => {
  const oembedFor = EMBED_OEMBED_ENDPOINT[provider];
  const fallback =
    EMBED_PROVIDER_FALLBACK[provider] ?? DEFAULT_EMBED_DIMENSIONS;

  if (!oembedFor) return scaleToMaxWidth(fallback);

  try {
    const response = await fetch(oembedFor(url));
    if (!response.ok) return scaleToMaxWidth(fallback);

    const data = await response.json();
    if (data?.width && data?.height) {
      return scaleToMaxWidth({ width: data.width, height: data.height });
    }

    return scaleToMaxWidth(fallback);
  } catch {
    return scaleToMaxWidth(fallback);
  }
};

// Cache the in-flight Promise so concurrent calls for the same URL share a
// single network request. Storing the resolved value would let two simultaneous
// callers both miss the cache and fire duplicate fetches.
export const detectAspectRatio = originalUrl => {
  if (!originalUrl) return Promise.resolve(DEFAULT_EMBED_DIMENSIONS);

  if (cache.has(originalUrl)) return cache.get(originalUrl);

  const provider = getProvider(originalUrl);
  const promise = fetchOembedDimensions(provider, originalUrl);
  cache.set(originalUrl, promise);

  return promise;
};
