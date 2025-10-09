import { t } from "i18next";
import { LeftAlign, CenterAlign, RightAlign, Delete } from "neetoicons";

import { FILE_SIZE_UNITS } from "./constants";

export const convertToFileSize = (size = 10 * 1024 * 1024) => {
  let fileSize = size;
  let i = 0;
  while (fileSize >= 1024 && i < FILE_SIZE_UNITS.length) {
    fileSize /= 1024;
    ++i;
  }

  return `${fileSize.toFixed(1)} ${FILE_SIZE_UNITS[i]}`;
};

export const buildImageOptions = (border = true) => [
  {
    Icon: LeftAlign,
    type: "button",
    alignPos: "left",
    optionName: t("neetoEditor.menu.alignLeft"),
  },
  {
    Icon: CenterAlign,
    type: "button",
    alignPos: "center",
    optionName: t("neetoEditor.menu.alignCenter"),
  },
  {
    Icon: RightAlign,
    type: "button",
    alignPos: "right",
    optionName: t("neetoEditor.menu.alignRight"),
  },
  {
    Icon: CustomSize,
    type: "dropdown",
    optionName: t("neetoEditor.menu.aspectRatio"),
    items: [
      { ratio: "16/9", tooltipLabel: "16/9" },
      { ratio: "4/3", tooltipLabel: "4/3" },
      { ratio: "3/2", tooltipLabel: "3/2" },
      { ratio: "1/1", tooltipLabel: "1/1" },
    ],
  },
  { Icon: Delete, type: "button", optionName: t("neetoEditor.menu.delete") },
];

export const getTabs = mediaUploader => {
  if (mediaUploader.video) {
    return [
      { title: "Upload", key: "local" },
      { title: "Link", key: "link" },
      { title: "Embed", key: "embed" },
    ];
  }

  return [];
};
