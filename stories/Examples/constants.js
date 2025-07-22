export const MENU_PROPS = [
  [
    "editor",
    "Accepts the instance of editor to which this this Menu component is associated with.",
    "editor",
  ],
  [
    "menuType",
    "Describes the menu type that editor should display. value should be one of ['fixed', 'bubble', 'none']. Defaults to 'fixed'.",
    `"bubble"`,
  ],
  [
    "isMenuCollapsible",
    "Accepts a boolean value. If true, the menu will be expanded by default.",
  ],
  [
    "defaults",
    "Accepts an array of strings, each corresponding to the name of a default option.",
    `["h1", "h2", "h3", "h4", "h5", "h6"]`,
  ],
  [
    "addons",
    "Accepts an array of strings, each corresponding to the name of an addon.",
    `["highlight", "emoji", "code-block", "block-quote", "image-upload", "video-upload", "divider", "paste-unformatted", text-color]`,
  ],
  [
    "className",
    "Accepts a string value. Can be used for further customisation of the editor wrapper layout.",
    `"neeto-editor-content"`,
  ],
  [
    "variables",
    "Accepts an array of variable suggestions.",
    `[{ label: "Subdomain", key: "subdomain" }]`,
  ],
  [
    "mentions",
    "Accepts an array of mention suggestions.",
    `[{ name: "Oliver Smith", key: "oliver-smith", imageUrl: "url" }]`,
  ],
  [
    "editorSecrets",
    "Accepts an object. Use this prop to pass down API keys and other secrets.",
    `{
      unsplash: "<unsplash-api-key>"
     }`,
  ],
  [
    "children",
    "Accepts React nodes to be rendered within the Menu.",
    `<Button icon={Camera} />`,
  ],
  [
    "tooltips",
    "Accepts an object. Use this prop to pass down custom tooltips for the options.",
    `{
      bold: "Bold",
      italic: "Italic",
      underline: "Underline",
      strke: "Strikethrough",
      attachments: "Attachment",
      code: "Code",
      blockQuote: "Blockquote",
      imageUpload: "Image Upload",
      videoUpload: "Video Upload",
      emoji: "Emoji",
      bulletList: "Bullet List",
      orderedList: "Ordered List",
      variables: "Variables",
      mention: "Mentions",
    }`,
  ],
];

export const VARIABLES = [
  {
    category: "ticket",
    label: "Ticket",
    variables: [
      {
        label: "ID",
        key: "id",
        value: "001",
      },
      {
        label: "Name",
        key: "name",
        value: "Ticket name",
      },
    ],
  },
  {
    label: "Subdomain",
    key: "subdomain",
    value: "subdomain name",
  },
  {
    label: "User",
    key: "user",
  },
  {
    category: "organisation",
    label: "Organisation",
    variables: [
      {
        label: "ID",
        key: "id",
      },
      {
        label: "Name",
        key: "name",
        value: "Organisation name",
      },
    ],
  },
];
