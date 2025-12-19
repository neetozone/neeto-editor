import { memo, useRef } from "react";

import { filterBy } from "neetocist";
import { Down } from "neetoicons";
import { Dropdown } from "neetoui";
import { last } from "ramda";

import useEditorStore from "src/stores/useEditorStore";

import { FONT_SIZE_OPTIONS } from "../../constants";

const { Menu, MenuItem } = Dropdown;

const FontSizeOption = ({
  runEditorCommand,
  tooltipContent,
  label,
  options = [],
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

  return (
    <Dropdown
      autoWidth
      placement="bottom-start"
      strategy="fixed"
      buttonProps={{
        icon: activeOption?.icon,
        iconPosition: "left",
        iconSize: 22,
        label: <Down size={12} />,
        ref: dropdownRef,
        "data-testid": "neeto-editor-fixed-menu-font-size-option",
        onKeyDown: event =>
          event.key === "ArrowDown" && dropdownRef.current?.click(),
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        style: "text",
        size: "small",
        className:
          "neeto-editor-fixed-menu__item neeto-editor-font-size__wrapper",
      }}
    >
      <Menu className="neeto-ui-flex neeto-ui-gap-1 neeto-editor-menu-font-size-options">
        {menuOptions.map(({ label, icon: Icon, value, key }) => (
          <MenuItem.Button
            className="neeto-editor-menu-font-size-options__item-btn"
            data-testid={`neeto-editor-fixed-menu-font-size-option-${key}`}
            key={value}
            tooltipProps={{ content: label, position: "bottom" }}
            onClick={() => handleClick(value)}
          >
            <Icon size={22} />
          </MenuItem.Button>
        ))}
      </Menu>
    </Dropdown>
  );
};

export default memo(FontSizeOption);
