export const EDITOR_ADDONS_TABLE_COLUMNS = ["Prop", "Description"];

export const EDITOR_ADDONS_TABLE_ROWS = [
  ["attachments", "Add attachments to the editor."],
  ["block-quote", "Highlight a block of text as a quote."],
  ["callout", "Add highlighted information blocks with customizable types."],
  ["code-block", "Provide syntax highlighting for code snippets."],
  ["divider", "Add a horizontal line to separate different sections."],
  ["emoji", "Add emojis to your content using an emoji picker."],
  ["highlight", "Emphasize important texts by marking it with a color."],
  ["image-upload", "Upload images to the editor."],
  ["image-upload-unsplash", "Add unsplash integration to the image upload."],
  ["paste-unformatted", "Paste by removing all styles."],
  ["redo", "Redo last performed action."],
  ["table", "Add a table to the editor."],
  ["undo", "Undo last performed action."],
  [
    "video-upload",
    "Upload videos or embed from URLs (YouTube, Vimeo, Loom, NeetoRecord, Supademo).",
  ],
  ["text-color", "Change the color of the text."],
  ["todo-list", "Add a to-do list with checkboxes."],
  [
    "neeto-kb-article",
    "Insert links to NeetoKB articles from within the editor.",
  ],
];

export const EDITOR_PROP_TABLE_COLUMNS = [
  "Prop",
  "Description",
  "Sample Value",
];

export const EDITOR_CONTENT_PROP_TABLE_ROWS = [
  [
    "content",
    "Accepts a valid HTML string. Can pass the output of the editor directly.",
    `"<p>Hello World</p"`,
  ],
  [
    "className",
    "Accepts a string value. Can be used for further customisation of the editor content.",
    `"neeto-editor-content"`,
  ],
  [
    "variables",
    "Accepts an array of objects which cotains value to be substituted for the variables.",
    `[{key: "name", value: "John"}]`,
  ],
  [
    "configuration",
    "Accepts an object, enableHeaderLinks can be set to true or false in the configuration, default value is false.",
    `{enableHeaderLinks: true}`,
  ],
];

export const EDITOR_SHORTCUTS_TABLE_COLUMNS = [
  "Command",
  "Windows/Linux",
  "macOS",
];

export const EDITOR_SHORTCUTS_TABLE_ROWS = [
  ["Bold", "Ctrl + B", "Cmd + B"],
  ["Italicize", "Ctrl + I", "Cmd + I"],
  ["Underline", "Ctrl + U", "Cmd + U"],
  ["Strikethrough", "Ctrl + Shift + X", "Cmd + Shift + X"],
  ["Blockquote", "Ctrl + Shift + B", "Cmd + Shift + B"],
  ["Bullet List", "Ctrl + Shift + 8", "Cmd + Shift + 8"],
  ["Ordered List", "Ctrl + Shift + 7", "Cmd + Shift + 7"],
  ["To-do List", "Ctrl + Shift + 9", "Cmd + Shift + 9"],
  ["Table", "Ctrl + Alt + T", "Cmd + Opt + T"],
  ["Highlight", "Ctrl + Shift + H", "Cmd + Shift + H"],
  ["Emoji", "Ctrl + Alt + E", "Cmd + Opt + E"],
  ["Code Block", "Ctrl + Alt + C", "Cmd + Opt + C"],
  ["Image uploader", "Ctrl + Alt + I", "Cmd + Opt + K"],
  ["Upload attachments", "Ctrl + Alt + A", "Cmd + Opt + A"],
  ["Video uploader", "Ctrl + Alt + V", "Cmd + Opt + V"],
];

export const CUSTOM_SLASH_COMMANDS_TABLE_COLUMNS = ["Property", "Description"];

export const CUSTOM_SLASH_COMMANDS_TABLE_ROWS = [
  [
    "title",
    "The name of the command that needs to be displayed. Accepts String values.",
  ],
  ["description", "The description for the command. Accepts String values."],
  [
    "optionName",
    "Unique key value for each command item. Accepts String values.",
  ],
  [
    "Icon",
    "The Icon that should be shown for command. Accepts a valid React component.",
  ],
  [
    "command",
    "A function which takes an object {editor, range} as it's argument. It may execute any commands using this editor instance.",
  ],
  [
    "items",
    "Accepts an array of items with all the above keys to create a nested command.",
  ],
  [
    "tooltip",
    "Accepts a string value. It is used to show a tooltip on hover of the menu icon.",
  ],
];

export const WELCOME_PAGE_CARDS = [
  {
    heading: "Getting started",
    description: "Everything you need to get up and running.",
    link: {
      label: "Read more",
      url: "?path=/docs/getting-started--page",
    },
  },
  {
    heading: "Menu types",
    description: "All the information on different menu types",
    link: {
      label: "Read more",
      url: "?path=/docs/walkthroughs-menutypes-bubble-menu--bubble-menu",
    },
  },
  {
    heading: "Examples",
    description: "A walkthrough of different usages of the editor",
    link: {
      label: "Read more",
      url: "?path=/docs/examples-basic--basic",
    },
  },
];
