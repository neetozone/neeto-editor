import { MenuHorizontal } from "neetoicons";
import { Button, Dropdown } from "neetoui";

import { buildImageOptions } from "../../MediaUploader/utils";

const Menu = ({ align, border, editor, updateAttributes, deleteNode }) => {
  const menuOptions = buildImageOptions(border);

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
      className="neeto-editor__image-menu"
      icon={MenuHorizontal}
      position="top"
      strategy="fixed"
    >
      {menuOptions.map(({ Icon, optionName, alignPos, borderToggle }) => (
        <Button
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
      ))}
    </Dropdown>
  );
};

export default Menu;
