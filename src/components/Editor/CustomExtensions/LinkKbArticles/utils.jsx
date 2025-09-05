import { Folder, File } from "neetoicons";

export const formatOptionLabel = option => {
  if (option?.value === "__back_to_categories__") {
    return (
      <div className="flex items-center gap-2">
        <span>← Back</span>
      </div>
    );
  }

  const isCategory = option?.data?.type === "category";
  const isArticle = option?.data?.type === "article";

  if (isCategory) {
    return (
      <div className="flex items-center gap-2">
        <Folder className="neeto-ui-text-gray-600" size={16} />
        <span>{option.label}</span>
      </div>
    );
  }

  if (isArticle) {
    return (
      <div className="flex items-center gap-2">
        <File className="neeto-ui-text-gray-600" size={16} />
        <span>{option.label}</span>
      </div>
    );
  }

  return option?.label || "";
};
