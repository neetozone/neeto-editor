import { Button, DropdownMenu, Tooltip } from "@bigbinary/neeto-atoms";
import { t } from "i18next";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Ellipsis,
  Ratio,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  SquareDashed,
  Trash2,
} from "lucide-react";

const { Menu: DropdownMenuList, MenuItem } = DropdownMenu;

const buildImageOptions = (border, showAspectRatio) => {
  const options = [
    {
      Icon: AlignLeft,
      type: "button",
      alignPos: "left",
      optionName: t("neetoEditor.menu.alignLeft"),
    },
    {
      Icon: AlignCenter,
      type: "button",
      alignPos: "center",
      optionName: t("neetoEditor.menu.alignCenter"),
    },
    {
      Icon: AlignRight,
      type: "button",
      alignPos: "right",
      optionName: t("neetoEditor.menu.alignRight"),
    },
  ];

  if (showAspectRatio) {
    options.push({
      Icon: Ratio,
      type: "dropdown",
      alignPos: "center",
      optionName: t("neetoEditor.menu.aspectRatio"),
      items: [
        { ratio: "16/9", tooltipLabel: "16/9", icon: RectangleHorizontal },
        { ratio: "9/16", tooltipLabel: "9/16", icon: RectangleVertical },
        { ratio: "4/3", tooltipLabel: "4/3", icon: RectangleHorizontal },
        { ratio: "3/2", tooltipLabel: "3/2", icon: RectangleHorizontal },
        { ratio: "1/1", tooltipLabel: "1/1", icon: Square },
      ],
    });
  }

  options.push(
    {
      Icon: border ? SquareDashed : Square,
      type: "button",
      alignPos: "center",
      borderToggle: true,
      optionName: border
        ? t("neetoEditor.menu.removeBorder")
        : t("neetoEditor.menu.addBorder"),
    },
    {
      Icon: Trash2,
      type: "button",
      optionName: t("neetoEditor.menu.delete"),
    }
  );

  return options;
};

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
      position="top-end"
      customTarget={
        <Button
          className="neeto-editor__image-menu-btn"
          icon={Ellipsis}
          size="lg"
          variant="secondary"
        />
      }
      dropdownProps={{
        className: "ne-editor-dropdown w-auto flex flex-row items-center gap-1",
      }}
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
              dropdownProps={{ className: "ne-editor-dropdown" }}
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
