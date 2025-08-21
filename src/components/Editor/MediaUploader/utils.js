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

export const buildImageOptions = () => [
  {
    Icon: LeftAlign,
    alignPos: "left",
    optionName: t("neetoEditor.menu.alignLeft"),
  },
  {
    Icon: CenterAlign,
    alignPos: "center",
    optionName: t("neetoEditor.menu.alignCenter"),
  },
  {
    Icon: RightAlign,
    alignPos: "right",
    optionName: t("neetoEditor.menu.alignRight"),
  },
  { Icon: Delete, optionName: t("neetoEditor.menu.delete") },
];

export const getTabs = mediaUploader => {
  if (mediaUploader.video) {
    return [
      { title: "Upload", key: "local" },
      { title: "Embed", key: "embed" },
    ];
  }

  return [];
};
