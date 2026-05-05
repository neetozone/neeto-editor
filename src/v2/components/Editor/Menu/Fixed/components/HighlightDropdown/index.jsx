import React, { useRef } from "react";

import { DropdownMenu, Typography } from "@bigbinary/neeto-atoms";
import { Highlighter } from "lucide-react";
import { hyphenize } from "neetocommons/utils";

import ColorDot from "./ColorDot";
import { COLORS } from "./constants";

const colorSections = [
  { title: "Text color", colors: COLORS.text, isTextColor: true },
  { title: "Background color", colors: COLORS.background, isTextColor: false },
];

const HighlightDropdown = ({
  editor,
  label,
  tooltipContent,
  runEditorCommand,
}) => {
  const dropdownRef = useRef(null);
  const textColor = editor.getAttributes("textStyle").color;
  const backgroundColor = editor.getAttributes("textStyle").backgroundColor;

  const updateBackgroundColor = value => {
    runEditorCommand(editor =>
      editor
        .chain()
        .focus()
        .setMark("textStyle", { backgroundColor: value })
        .run()
    )();
  };

  const handleBackgroundColorClick = (colorVar, event) => {
    event.stopPropagation();
    if (backgroundColor === `var(${colorVar})`) {
      updateBackgroundColor(null);
    } else {
      updateBackgroundColor(`var(${colorVar})`);
    }
  };

  const handleTextColorClick = (colorVar, event) => {
    event.stopPropagation();
    if (textColor === `var(${colorVar})`) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(`var(${colorVar})`).run();
    }
  };

  const renderColorDots = (colorList, isTextColor = false) =>
    colorList.map((colorVar, idx) => (
      <ColorDot
        {...{ colorVar, isTextColor }}
        key={idx}
        isSelected={
          isTextColor
            ? textColor === `var(${colorVar})`
            : backgroundColor === `var(${colorVar})`
        }
        onClick={event =>
          isTextColor
            ? handleTextColorClick(colorVar, event)
            : handleBackgroundColorClick(colorVar, event)
        }
      />
    ));

  return (
    <DropdownMenu
      icon={Highlighter}
      position="bottom-start"
      triggerRef={dropdownRef}
      buttonProps={{
        "data-testid": "neeto-editor-fixed-menu-highlight-option",
        onKeyDown: event =>
          event.key === "ArrowDown" && dropdownRef.current?.click(),
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        variant: "ghost",
        className: "ne-toolbar-item ne-toolbar-dropdown",
      }}
      dropdownProps={{ className: "ne-editor-dropdown w-[280px] p-3" }}
    >
      <DropdownMenu.Menu className="neeto-editor-highlight-dropdown">
        {colorSections.map(({ title, colors, isTextColor }) => (
          <div className="neeto-editor-highlight-dropdown__section" key={title}>
            <Typography
              className="neeto-editor-highlight-dropdown__section-title"
              variant="body2"
              weight="medium"
            >
              {title}
            </Typography>
            <div
              className="neeto-editor-highlight-dropdown__color-grid"
              data-testid={`neeto-editor-highlight-${hyphenize(title)}-grid`}
            >
              {renderColorDots(colors, isTextColor)}
            </div>
          </div>
        ))}
      </DropdownMenu.Menu>
    </DropdownMenu>
  );
};

export default HighlightDropdown;
