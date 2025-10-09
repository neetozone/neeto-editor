import { MenuHorizontal, CustomSize, Down } from "neetoicons";
import { Button, Dropdown, Tooltip } from "neetoui";

import { buildImageOptions } from "../../MediaUploader/utils";

const { Menu: DropdownMenu, MenuItem } = Dropdown;

const Menu = ({ align, editor, updateAttributes, deleteNode }) => {
  const menuOptions = buildImageOptions();

  const handleClick = align => {
    align ? updateAttributes({ align }) : deleteNode();
    editor.commands.focus();
  };

  return (
    <Dropdown
      buttonProps={{ className: "neeto-editor__image-menu-btn" }}
      buttonSize="large"
      buttonStyle="tertiary"
      className="neeto-editor__image-menu"
      icon={MenuHorizontal}
      position="top"
      strategy="fixed"
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
            <DropdownMenu>
              {items?.map(({ ratio }) => (
                <MenuItem.Button
                  key={ratio}
                  onClick={() => updateAttributes({ aspectRatio: ratio })}
                >
                  {ratio}
                </MenuItem.Button>
              ))}
            </DropdownMenu>
          </Dropdown>
        )
      )}
    </Dropdown>
  );
};

export default Menu;
