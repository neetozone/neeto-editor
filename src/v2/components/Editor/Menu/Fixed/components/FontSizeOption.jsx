import { memo, useRef } from "react";

import { DropdownMenu } from "@bigbinary/neeto-atoms";
import { filterBy } from "neetocist";
import { last } from "ramda";

import useEditorStore from "src/stores/useEditorStore";

import { FONT_SIZE_OPTIONS } from "../../constants";

const { Menu, MenuItem } = DropdownMenu;

const FontSizeOption = ({
  runEditorCommand,
  tooltipContent,
  label,
  options = [],
  isSecondaryMenu = false,
}) => {
  const dropdownRef = useRef(null);

  const lastOption = last(FONT_SIZE_OPTIONS);
  const { fontSizeOption: activeOption = lastOption } =
    useEditorStore.pick("marksState");

  const handleClick = level =>
    level
      ? runEditorCommand(editor =>
          editor.chain().focus().toggleHeading({ level }).run()
        )()
      : runEditorCommand(editor =>
          editor.chain().focus().setNode("paragraph").run()
        )();

  const menuOptions = [
    ...filterBy({ key: key => options.includes(key) }, FONT_SIZE_OPTIONS),
    FONT_SIZE_OPTIONS[FONT_SIZE_OPTIONS.length - 1],
  ];

  const renderItems = menuOptions.map(
    ({ label: itemLabel, icon: Icon, value, key }) => (
      <MenuItem
        data-testid={`neeto-editor-fixed-menu-font-size-option-${key}`}
        isActive={activeOption?.value === value}
        key={value}
        prefix={<Icon size={16} />}
        onClick={() => handleClick(value)}
      >
        {itemLabel}
      </MenuItem>
    )
  );

  if (isSecondaryMenu) {
    return (
      <DropdownMenu.SubMenu
        {...{ label }}
        contentProps={{ className: "ne-editor-dropdown" }}
        icon={activeOption?.icon}
        triggerProps={{
          "data-testid": "neeto-editor-fixed-menu-font-size-option",
        }}
      >
        {renderItems}
      </DropdownMenu.SubMenu>
    );
  }

  return (
    <DropdownMenu
      dropdownProps={{ className: "ne-editor-dropdown" }}
      icon={activeOption?.icon}
      position="bottom-start"
      triggerRef={dropdownRef}
      buttonProps={{
        "data-testid": "neeto-editor-fixed-menu-font-size-option",
        onKeyDown: event =>
          event.key === "ArrowDown" && dropdownRef.current?.click(),
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        variant: "ghost",
        className:
          "ne-toolbar-item ne-toolbar-dropdown neeto-editor-font-size__wrapper",
      }}
    >
      <Menu>{renderItems}</Menu>
    </DropdownMenu>
  );
};

export default memo(FontSizeOption);
