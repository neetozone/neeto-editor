import React, { useRef } from "react";

import { DropdownMenu, Typography } from "@bigbinary/neeto-atoms";
import { findBy } from "neetocist";
import { useTranslation } from "react-i18next";

import CalloutIcon from "./CalloutIcon";
import { CALLOUT_TYPES } from "./constants";
import RenderCalloutOptions from "./RenderCalloutOptions";

const CalloutDropdown = ({ editor, label, tooltipContent }) => {
  const { t } = useTranslation();
  const dropdownRef = useRef(null);

  const isInCallout = editor.isActive("callout");
  const currentCalloutAttrs = isInCallout
    ? editor.getAttributes("callout")
    : null;

  const currentType =
    findBy({ type: currentCalloutAttrs?.type }, CALLOUT_TYPES) ||
    CALLOUT_TYPES[0];

  const handleCalloutTypeClick = calloutType => {
    const editorChain = editor.chain().focus();
    const isSameType =
      isInCallout && currentCalloutAttrs?.type === calloutType.type;

    if (isSameType) {
      editorChain.lift("callout").run();
    } else if (isInCallout) {
      editorChain
        .updateAttributes("callout", {
          type: calloutType.type,
          emoji: calloutType.emoji,
        })
        .run();
    } else {
      editorChain
        .setCallout({ type: calloutType.type, emoji: calloutType.emoji })
        .run();
    }
  };

  return (
    <DropdownMenu
      icon={<CalloutIcon currentType={isInCallout ? currentType : null} />}
      position="bottom-start"
      triggerRef={dropdownRef}
      buttonProps={{
        "data-testid": "neeto-editor-fixed-menu-callout-option",
        onKeyDown: event =>
          event.key === "ArrowDown" && dropdownRef.current?.click(),
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        variant: isInCallout ? "secondary" : "ghost",
        size: "sm",
        className: "neeto-editor-fixed-menu__item",
      }}
    >
      <DropdownMenu.Menu className="neeto-editor-callout-dropdown">
        <div className="neeto-editor-callout-dropdown__section">
          <Typography
            className="neeto-editor-callout-dropdown__section-title"
            variant="body2"
            weight="normal"
          >
            {t("neetoEditor.menu.selectCalloutType")}
          </Typography>
          <div className="neeto-editor-callout-dropdown__options-grid">
            <RenderCalloutOptions
              {...{ currentCalloutAttrs, handleCalloutTypeClick, isInCallout }}
            />
          </div>
        </div>
      </DropdownMenu.Menu>
    </DropdownMenu>
  );
};

export default CalloutDropdown;
