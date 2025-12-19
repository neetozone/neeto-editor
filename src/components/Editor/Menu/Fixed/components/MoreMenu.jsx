import { MenuHorizontal } from "neetoicons";
import { Dropdown } from "neetoui";

import { generateFocusProps } from "utils/focusHighlighter";

import { MENU_ELEMENTS, MENU_ELEMENT_TYPES } from "../constants";

const { Menu, MenuItem } = Dropdown;

const MoreMenu = ({ groups, editor }) => (
  <Dropdown
    buttonProps={{ className: "flex-shrink-0" }}
    buttonStyle="text"
    icon={MenuHorizontal}
    strategy="fixed"
  >
    <Menu>
      {groups.map(group =>
        group.map(({ type, ...props }) => {
          const Component = MENU_ELEMENTS[type];

          if (type === MENU_ELEMENT_TYPES.BUTTON) {
            const { icon: Icon } = props;

            return (
              <MenuItem.Button
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
              </MenuItem.Button>
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
  </Dropdown>
);

export default MoreMenu;
