import { Button, DropdownMenu } from "@bigbinary/neeto-atoms";
import { Ellipsis } from "lucide-react";

import { generateFocusProps } from "utils/focusHighlighter";

import { MENU_ELEMENTS, MENU_ELEMENT_TYPES } from "../constants";

const { Menu, MenuItem } = DropdownMenu;

const MoreMenu = ({ groups, editor }) => (
  <DropdownMenu
    dropdownProps={{ className: "ne-editor-dropdown" }}
    customTarget={
      <Button className="flex-shrink-0" icon={Ellipsis} variant="ghost" />
    }
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
                prefix={<Icon size={16} />}
                tabIndex="-1"
                onClick={props.command}
                {...{
                  ...generateFocusProps(props.highlight),
                  ...props,
                  editor,
                }}
              >
                {props.label}
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
