import { useCallback } from "react";

import { Button, DropdownMenu } from "@bigbinary/neeto-atoms";
import { BubbleMenu } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { sticky } from "tippy.js";

import { tableActions } from "components/Editor/CustomExtensions/Table/utils";

const { Menu, MenuItem } = DropdownMenu;

const alignmentIcons = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
};

const TableActionMenu = ({ editor }) => {
  const getReferenceClientRect = useCallback(() => {
    if (!editor) return new DOMRect(0, 0, 0, 0);

    const { $anchor: anchor } = editor.state?.selection ?? {};
    const node = editor.view.domAtPos(anchor?.pos)?.node;
    const element = node?.nodeType === 3 ? node?.parentElement : node;

    return element?.getBoundingClientRect() || new DOMRect(0, 0, 0, 0);
  }, [editor]);

  const shouldShow = useCallback(
    () => editor?.isFocused && editor?.isActive("table"),
    [editor]
  );

  if (!editor) return null;

  return (
    <BubbleMenu
      {...{ editor, shouldShow }}
      className="neeto-editor-bubble-menu"
      tippyOptions={{
        arrow: false,
        offset: [10, 10],
        zIndex: 99999,
        theme: "light neeto-editor-bubble-menu-tippy-box",
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        plugins: [sticky],
        sticky: "popper",
      }}
    >
      {tableActions({ editor }).map(action => {
        if (action.isHidden) return null;

        if (action.type) {
          return (
            <DropdownMenu
              className="neeto-editor-table-bubble-menu__dropdown"
              closeOnSelect={false}
              key={action.label}
              position="bottom-start"
              icon={AlignLeft}
              buttonProps={{
                className: "neeto-editor-table-bubble-menu__dropdown-item",
                size: "sm",
                variant: "ghost",
                tooltipProps: {
                  content: action.label,
                  position: "top",
                },
              }}
              dropdownProps={{ className: "ne-editor-dropdown" }}
            >
              <Menu className="flex items-center justify-center">
                {action.items?.map(({ type, command, tooltipLabel }) => {
                  const IconComponent = alignmentIcons[type];

                  return (
                    <MenuItem key={type}>
                      <Button
                        className="ne-toolbar-item"
                        icon={IconComponent}
                        variant="ghost"
                        tooltipProps={{
                          content: tooltipLabel,
                          position: "bottom",
                        }}
                        onClick={command}
                      />
                    </MenuItem>
                  );
                })}
              </Menu>
            </DropdownMenu>
          );
        }

        return (
          <Button
            className="ne-toolbar-item"
            icon={action.icon}
            key={action.label}
            size="sm"
            variant="ghost"
            tooltipProps={{
              content: action.label,
              position: "top",
            }}
            onClick={action.command}
          />
        );
      })}
    </BubbleMenu>
  );
};

export default TableActionMenu;
