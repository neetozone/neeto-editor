import { DropdownMenu } from "@bigbinary/neeto-atoms";
import { Ellipsis } from "lucide-react";

import { MENU_ELEMENTS, MENU_ELEMENT_TYPES } from "../constants";
import { generateFocusProps } from "utils/focusHighlighter";

const { Menu, MenuItem } = DropdownMenu;

const MoreMenu = ({ groups, editor }) => (
  <DropdownMenu
    buttonProps={{ className: "flex-shrink-0", variant: "ghost" }}
    icon={Ellipsis}
  >
    <Menu>
      {groups.map(group =>
        group.map(({ type, ...props }) => {
          const Component = MENU_ELEMENTS[type];

          if (type === MENU_ELEMENT_TYPES.BUTTON) {
            const { icon: Icon } = props;

            return (
              <MenuItem
                data-testid={`neeto-editor-fixed-menu-${props.optionName}-option`}
                isActive={editor.isActive(props.optionName)}
                key={props.optionName}
                tabIndex="-1"
                onClick={props.command}
                {...{
                  ...generateFocusProps(props.highlight),
                  ...props,
                  editor,
                }}
              >
                <Icon /> {props.label}
              </MenuItem>
            );
          }

          return (
            <Component
              key={props.optionName}
              {...{ ...props, editor, ...generateFocusProps(props.highlight) }}
              isSecondaryMenu
            />
          );
        })
      )}
    </Menu>
  </DropdownMenu>
);

export default MoreMenu;
