import React, { useRef } from "react";

import { DropdownMenu } from "@bigbinary/neeto-atoms";
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
      dropdownProps={{ className: "ne-editor-dropdown w-[200px] p-2" }}
      icon={<CalloutIcon currentType={isInCallout ? currentType : null} />}
      position="bottom-start"
      triggerRef={dropdownRef}
      buttonProps={{
        "data-testid": "neeto-editor-fixed-menu-callout-option",
        onKeyDown: event =>
          event.key === "ArrowDown" && dropdownRef.current?.click(),
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        variant: isInCallout ? "secondary" : "ghost",
        className: "ne-toolbar-item ne-toolbar-dropdown",
      }}
    >
      <DropdownMenu.Menu>
        <DropdownMenu.Label>
          {t("neetoEditor.menu.selectCalloutType")}
        </DropdownMenu.Label>
        <RenderCalloutOptions
          {...{ currentCalloutAttrs, handleCalloutTypeClick, isInCallout }}
        />
      </DropdownMenu.Menu>
    </DropdownMenu>
  );
};

export default CalloutDropdown;
