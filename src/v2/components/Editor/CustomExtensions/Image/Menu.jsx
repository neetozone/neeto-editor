import { Button, DropdownMenu, Tooltip } from "@bigbinary/neeto-atoms";
import { ChevronDown, Ellipsis, Ratio } from "lucide-react";

import { buildImageOptions } from "components/Editor/MediaUploader/utils";

const { Menu: DropdownMenuList, MenuItem } = DropdownMenu;

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
    <DropdownMenu
      buttonProps={{
        className: "neeto-editor__image-menu-btn",
        size: "lg",
        variant: "secondary",
      }}
      className="neeto-editor__image-menu neeto-editor-bubble-menu"
      icon={Ellipsis}
      position="top"
    >
      {menuOptions.map(
        ({ Icon, optionName, alignPos, type, items, border, borderToggle }) =>
          type === "button" ? (
            <Button
              className="ne-toolbar-item"
              data-testid={`neeto-editor-image-menu-${optionName}`}
              icon={Icon}
              key={optionName}
              tooltipProps={{ content: optionName, position: "top" }}
              variant={
                alignPos === align || (borderToggle && border)
                  ? "secondary"
                  : "ghost"
              }
              onClick={() => handleClick(alignPos, borderToggle)}
            />
          ) : (
            <DropdownMenu
              key={optionName}
              position="bottom-start"
              buttonProps={{
                tooltipProps: {
                  content: optionName,
                  position: "top",
                },
              }}
              customTarget={
                <MenuItem className="ne-toolbar-item !relative">
                  <Tooltip content={optionName} position="top">
                    <div className="flex items-center justify-center gap-x-1">
                      <Ratio size={18} />
                      <ChevronDown size={14} />
                    </div>
                  </Tooltip>
                </MenuItem>
              }
              onClick={event => event.stopPropagation()}
            >
              <DropdownMenuList className="mb-0">
                {items?.map(({ ratio, icon: Icon }) => (
                  <MenuItem
                    key={ratio}
                    onClick={() => updateAttributes({ aspectRatio: ratio })}
                  >
                    {Icon && <Icon size={18} />}
                    {ratio}
                  </MenuItem>
                ))}
              </DropdownMenuList>
            </DropdownMenu>
          )
      )}
    </DropdownMenu>
  );
};

export default Menu;
