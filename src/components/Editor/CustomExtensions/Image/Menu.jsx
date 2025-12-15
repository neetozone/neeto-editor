import { MenuHorizontal, AspectRatio, Down } from "neetoicons";
import { Button, Dropdown, Tooltip } from "neetoui";

import { buildImageOptions } from "../../MediaUploader/utils";

const { Menu: DropdownMenu, MenuItem } = Dropdown;

const Menu = ({
  align,
  border,
  editor,
  updateAttributes,
  deleteNode,
  showAspectRatio,
}) => {
  const menuOptions = buildImageOptions(border, showAspectRatio);

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
      {menuOptions.map(
        ({ Icon, optionName, alignPos, type, items, border, borderToggle }) =>
          type === "button" ? (
            <Button
              className="neeto-editor-bubble-menu__item"
              data-cy={`neeto-editor-image-menu-${optionName}`}
              icon={Icon}
              key={optionName}
              tooltipProps={{ content: optionName, position: "top" }}
              style={
                alignPos === align || (borderToggle && border)
                  ? "secondary"
                  : "text"
              }
              onClick={() => handleClick(alignPos, borderToggle)}
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
                <MenuItem.Button className="neeto-editor-bubble-menu__item !relative">
                  <Tooltip content={optionName} position="top">
                    <div className="neeto-ui-flex neeto-ui-items-center neeto-ui-justify-center gap-x-1">
                      <AspectRatio size={18} />
                      <Down size={14} />
                    </div>
                  </Tooltip>
                </MenuItem.Button>
              }
              onClick={event => event.stopPropagation()}
            >
              <DropdownMenu className="mb-0">
                {items?.map(({ ratio, icon: Icon }) => (
                  <MenuItem.Button
                    key={ratio}
                    onClick={() => updateAttributes({ aspectRatio: ratio })}
                  >
                    {Icon && <Icon size={18} />}
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
