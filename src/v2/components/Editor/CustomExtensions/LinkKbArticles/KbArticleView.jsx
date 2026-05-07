import React from "react";

import { Button } from "@bigbinary/neeto-atoms";
import classnames from "classnames";
import { BookOpen, Pencil } from "lucide-react";
import { withT } from "neetocommons/react-utils";
// CopyToClipboardButton from molecules v1 — molecules /v2 not available in
// installed version; revisit during molecules upgrade.
import CopyToClipboardButton from "neetomolecules/CopyToClipboardButton";

import { decodeHtmlEntities } from "src/utils/common";

const KbArticleView = withT(
  ({ t, linkAttributes, isDeleted, onEdit, onDeletedClick, currentText }) => (
    <div>
      <div className="flex items-center gap-3">
        <BookOpen className="text-gray-600" size={16} />
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
            icon={Pencil}
            size="sm"
            variant="ghost"
            tooltipProps={{
              content: t("neetoEditor.common.edit"),
              position: "top",
            }}
            onClick={onEdit}
          />
        </div>
      </div>
      {isDeleted && (
        <div className="mt-2 rounded p-2 text-sm">
          {t("neetoEditor.linkKb.articleDeletedDescription")}
        </div>
      )}
    </div>
  )
);

export default KbArticleView;
