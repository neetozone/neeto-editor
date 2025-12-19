import React from "react";

import classnames from "classnames";
import { withT } from "neetocommons/react-utils";
import { Edit, Articles } from "neetoicons";
import CopyToClipboardButton from "neetomolecules/CopyToClipboardButton";
import { Button } from "neetoui";

import { decodeHtmlEntities } from "src/utils/common";

const KbArticleView = withT(
  ({ t, linkAttributes, isDeleted, onEdit, onDeletedClick, currentText }) => (
    <div>
      <div className="flex items-center gap-3">
        <Articles className="neeto-ui-text-gray-600" size={16} />
        <a
          href={linkAttributes?.href}
          rel="noreferrer"
          target="_blank"
          className={classnames("ne-link-popover__kb-article-link", {
            "ne-link-popover__kb-article-link--deleted": isDeleted,
          })}
          onClick={event => {
            if (!isDeleted) return;
            event.preventDefault();
            onDeletedClick?.();
          }}
        >
          {currentText ||
            decodeHtmlEntities(linkAttributes?.title || "") ||
            linkAttributes?.href}
        </a>
        <div className="flex items-center gap-0.5">
          <CopyToClipboardButton
            size="small"
            style="text"
            value={linkAttributes?.href}
          />
          <Button
            className="ne-link-popover__option-button mx-0"
            data-testid="neeto-editor-link-popover-edit"
            icon={Edit}
            size="small"
            style="text"
            tooltipProps={{
              content: t("neetoEditor.common.edit"),
              position: "top",
            }}
            onClick={onEdit}
          />
        </div>
      </div>
      {isDeleted && (
        <div className="neeto-ui-rounded mt-2 p-2 text-sm">
          {t("neetoEditor.linkKb.articleDeletedDescription")}
        </div>
      )}
    </div>
  )
);

export default KbArticleView;
