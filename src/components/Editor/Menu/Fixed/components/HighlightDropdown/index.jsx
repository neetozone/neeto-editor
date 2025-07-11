import React, { useRef } from "react";

import { Down } from "neetoicons";
import { Typography, Dropdown } from "neetoui";

import ColorDot from "./ColorDot";
import ColorDotIcon from "./ColorDotIcon";
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
    <Dropdown
      autoWidth
      placement="bottom-start"
      strategy="fixed"
      buttonProps={{
        icon: () => <ColorDotIcon {...{ backgroundColor, textColor }} />,
        iconPosition: "left",
        iconSize: 20,
        label: <Down size={12} />,
        ref: dropdownRef,
        "data-cy": "neeto-editor-fixed-menu-highlight-option",
        onKeyDown: event =>
          event.key === "ArrowDown" && dropdownRef.current?.click(),
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        style: "text",
        size: "small",
        className: "neeto-editor-fixed-menu__item",
      }}
    >
      <Dropdown.Menu className="neeto-editor-highlight-dropdown">
        {colorSections.map(({ title, colors, isTextColor }) => (
          <div className="neeto-editor-highlight-dropdown__section" key={title}>
            <Typography
              className="neeto-editor-highlight-dropdown__section-title"
              style="body2"
              weight="normal"
            >
              {title}
            </Typography>
            <div className="neeto-editor-highlight-dropdown__color-grid">
              {renderColorDots(colors, isTextColor)}
            </div>
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default HighlightDropdown;
