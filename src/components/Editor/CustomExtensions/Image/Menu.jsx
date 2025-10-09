import { MenuHorizontal, CustomSize, Down } from "neetoicons";
import { Button, Dropdown, Tooltip } from "neetoui";

import { buildImageOptions } from "../../MediaUploader/utils";

const { Menu: DropdownMenu, MenuItem } = Dropdown;

const Menu = ({ align, editor, updateAttributes, deleteNode }) => {
  const menuOptions = buildImageOptions();

  const handleClick = (alignPos, borderToggle) => {
    if (borderToggle) {
      updateAttributes({ border: !border });
    } else if (alignPos) {
      updateAttributes({ align: alignPos });
    } else {
      deleteNode();
    }
    editor.commands.focus();
  };

  return (
    <Dropdown
      buttonProps={{ className: "neeto-editor__image-menu-btn" }}
      buttonSize="large"
      buttonStyle="tertiary"
      className="neeto-editor__image-menu neeto-editor-bubble-menu"
      icon={MenuHorizontal}
      position="top"
      strategy="fixed"
      theme="light neeto-editor-common-submenu-tippy-box"
    >
      {menuOptions.map(({ Icon, optionName, alignPos, type, items }) =>
        type === "button" ? (
          <Button
            data-cy={`neeto-editor-image-menu-${optionName}`}
            icon={Icon}
            key={optionName}
            style={alignPos === align ? "secondary" : "text"}
            tooltipProps={{ content: optionName, position: "top" }}
            onClick={() => handleClick(alignPos)}
          />
        ) : (
          <Dropdown
            appendTo={() => document.body}
            className="neeto-editor-table-bubble-menu__dropdown"
            closeOnSelect={false}
            key={optionName}
            position="bottom-start"
            strategy="fixed"
            buttonProps={{
              tooltipProps: {
                content: optionName,
                position: "top",
                delay: [500],
              },
            }}
            customTarget={
              <MenuItem.Button className="!relative">
                <Tooltip content={optionName} position="top">
                  <div className="neeto-ui-flex neeto-ui-items-center neeto-ui-justify-center gap-x-1">
                    <CustomSize size={16} />
                    <Down size={14} />
                  </div>
                </Tooltip>
              </MenuItem.Button>
            }
            onClick={event => event.stopPropagation()}
          >
            <DropdownMenu className="neeto-ui-flex neeto-ui-items-center neeto-ui-justify-center">
              {items?.map(({ ratio, tooltipLabel }) => (
                <MenuItem key={ratio}>
                  <Button
                    className="neeto-editor-table-bubble-menu__item"
                    label={ratio}
                    style="text"
                    tooltipProps={{
                      content: tooltipLabel,
                      position: "bottom",
                      delay: [500],
                    }}
                    onClick={() => {
                      editor.commands.focus();
                    }}
                  />
                </MenuItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )
      )}
    </Dropdown>
  );
};

export default Menu;
