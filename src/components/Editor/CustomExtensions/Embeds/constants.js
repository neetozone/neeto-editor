export const MAX_EMBED_WIDTH = 600;

export const DEFAULT_EMBED_DIMENSIONS = { width: 500, height: 281 };

export const EMBED_PROVIDER_FALLBACK = {
  youtube: { width: 1280, height: 720 },
  vimeo: { width: 1280, height: 720 },
  loom: { width: 1280, height: 720 },
  neetoRecord: { width: 1920, height: 1080 },
  neetoRecordCustom: { width: 1920, height: 1080 },
  supademo: { width: 1920, height: 1080 },
};

export const EMBED_OEMBED_ENDPOINT = {
  youtube: url =>
    `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
  vimeo: url =>
    `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  loom: url => `https://www.loom.com/v1/oembed?url=${encodeURIComponent(url)}`,
};
