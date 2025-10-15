import { useCallback } from "react";

import { BubbleMenu } from "@tiptap/react";
import { CenterAlign, Down, LeftAlign, RightAlign } from "neetoicons";
import { Button, Dropdown } from "neetoui";
import { sticky } from "tippy.js";

import { tableActions } from "./utils";

const { Menu, MenuItem } = Dropdown;

const alignmentIcons = {
  left: LeftAlign,
  center: CenterAlign,
  right: RightAlign,
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
            <Dropdown
              appendTo={() => document.body}
              className="neeto-editor-table-bubble-menu__dropdown"
              closeOnSelect={false}
              key={action.label}
              position="bottom-start"
              strategy="fixed"
              buttonProps={{
                className: "neeto-editor-table-bubble-menu__dropdown-item",
                icon: Down,
                iconPosition: "right",
                iconSize: 16,
                label: <LeftAlign />,
                size: "small",
                style: "text",
                tooltipProps: {
                  content: action.label,
                  position: "top",
                  delay: [500],
                },
              }}
            >
              <Menu className="neeto-ui-flex neeto-ui-items-center neeto-ui-justify-center">
                {action.items?.map(({ type, command, tooltipLabel }) => {
                  const IconComponent = alignmentIcons[type];

                  return (
                    <MenuItem key={type}>
                      <Button
                        className="neeto-editor-table-bubble-menu__item"
                        icon={IconComponent}
                        style="text"
                        tooltipProps={{
                          content: tooltipLabel,
                          position: "bottom",
                          delay: [500],
                        }}
                        onClick={command}
                      />
                    </MenuItem>
                  );
                })}
              </Menu>
            </Dropdown>
          );
        }

        return (
          <Button
            className="neeto-editor-table-bubble-menu__item"
            icon={action.icon}
            iconSize={18}
            key={action.label}
            size="small"
            style="text"
            tooltipProps={{
              content: action.label,
              position: "top",
              delay: [500],
            }}
            onClick={action.command}
          />
        );
      })}
    </BubbleMenu>
  );
};

export default TableActionMenu;
