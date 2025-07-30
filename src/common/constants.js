import { pluck } from "ramda";

export const EDITOR_OPTIONS = {
  // DEFAULT EDITOR OPTIONS
  BOLD: "bold",
  ITALIC: "italic",
  UNDERLINE: "underline",
  STRIKETHROUGH: "strike",
  LINK: "link",
  PARAGRAPH: "paragraph",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
  LIST_BULLETS: "bullet-list",
  LIST_ORDERED: "ordered-list",
  CODE: "code",

  // ADDON EDITOR OPTIONS
  CODE_BLOCK: "code-block",
  BLOCKQUOTE: "block-quote",
  CALLOUT: "callout",
  ATTACHMENTS: "attachments",
  TODO_LIST: "todo-list",
  TOGGLE_LIST: "toggle-list",
  UNDO: "undo",
  REDO: "redo",
  HIGHLIGHT: "highlight",
  EMOJI: "emoji",
  IMAGE_UPLOAD: "image-upload",
  IMAGE_UPLOAD_UNSPLASH: "image-upload-unsplash",
  VIDEO_UPLOAD: "video-upload",
  DIVIDER: "divider",
  PASTE_UNFORMATTED: "paste-unformatted",
  TABLE: "table",
  TEXT_COLOR: "text-color",
};

export const UNSPLASH_BASE_URL = "https://api.unsplash.com/search/photos";

export const DIRECT_UPLOAD_ENDPOINT = "/api/direct_uploads";

export const URL_REGEXP =
  /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

// HTTP/HTTPS/FTP with :// or Non-slash protocols like mailto:, tel: or Domain without protocol
export const ALL_PROTOCOL_URL_REGEXP =
  /^[a-zA-Z]\w*:\/\/[a-zA-Z0-9@:%._+~#=-]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)|^[a-zA-Z]\w*:[^//][a-zA-Z0-9@:%._+~#=?&-]*|^[a-zA-Z0-9@:%._+~#=-]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i;

export const YOUTUBE_URL_REGEXP =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S*?)(\?[^#]*)?$/;

export const VIMEO_URL_REGEXP =
  /((?:http|https):\/\/)?(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|(?:manage\/)?videos?\/|)(\d+)(?:(?:\/|\?h=)(\w+))?(?:|\/\?)(\?[^#]*)?/;

export const LOOM_URL_REGEXP =
  /((?:http|https):\/\/)?(www\.)?loom\.com\/(share|embed)\/([a-f0-9]{32})(?:\?sid=([a-f0-9-]{36}))?(?:\?t=(\d+))?(\?[^#]*)?/;

export const NEETO_RECORD_URL_REGEXP =
  /((?:http|https):\/\/)?(www\.)?[a-zA-Z0-9-]+\.(neetorecord\.com)\/(watch)\/([0-9a-f]{20})/;

export const SUPA_DEMO_URL_REGEXP =
  /((?:http|https):\/\/)?(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+)\/(demo|embed)\/([0-9a-z]+)/;

export const COMBINED_REGEX = new RegExp(
  pluck("source", [
    YOUTUBE_URL_REGEXP,
    VIMEO_URL_REGEXP,
    LOOM_URL_REGEXP,
    NEETO_RECORD_URL_REGEXP,
    SUPA_DEMO_URL_REGEXP,
  ]).join("|"),
  "g"
);

export const URL_VALIDATORS = {
  youtube: url => {
    const match = url.match(YOUTUBE_URL_REGEXP);

    return match && `https://www.youtube.com/embed/${match[5]}`;
  },
  vimeo: url => {
    const match = url.match(VIMEO_URL_REGEXP);

    return match && `https://player.vimeo.com/video/${match[4]}?h=${match[5]}`;
  },
  loom: url => {
    const match = url.match(LOOM_URL_REGEXP);

    return (
      match && `https://www.loom.com/embed/${match[4]}?t=${match[5] || ""}`
    );
  },
  neetoRecord: url => {
    const match = url.match(NEETO_RECORD_URL_REGEXP);

    return match && url.replace("watch", "embeds");
  },
  supademo: url => {
    const match = url.match(SUPA_DEMO_URL_REGEXP);

    return (
      match && `https://${match[3]}.${match[4]}/embed/${match[6]}?embed_v=2`
    );
  },
};

export const EDITOR_SIZES = {
  MEDIUM: "medium",
  LARGE: "large",
  SMALL: "small",
};
