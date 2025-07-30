import {
  Details,
  DetailsContent,
  DetailsSummary,
} from "@tiptap/extension-details";
import Placeholder from "@tiptap/extension-placeholder";
import { t } from "i18next";

export const ToggleList = Details.configure({
  persist: true,
  HTMLAttributes: { class: "neeto-editor-toggle-list" },
  openClassName: "is-open",
});

export const ToggleListSummary = DetailsSummary;

export const ToggleListContent = DetailsContent;

export const ToggleListPlaceholder = Placeholder.configure({
  includeChildren: true,
  placeholder: ({ node }) => {
    if (node.type.name === "detailsSummary") {
      return t("neetoEditor.placeholders.toggleSummary");
    }

    return null;
  },
});

export default ToggleList;
