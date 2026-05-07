import { memo } from "react";

import { Avatar, DropdownMenu } from "@bigbinary/neeto-atoms";
import { AtSign } from "lucide-react";
import { isEmpty } from "ramda";

import SecondaryMenuTarget from "src/v2/components/Editor/Menu/Fixed/components/SecondaryMenuTarget";

const { Menu, MenuItem } = DropdownMenu;

const Mentions = ({
  editor,
  mentions,
  tooltipContent,
  isSecondaryMenu = false,
  label,
}) => {
  if (isEmpty(mentions)) return null;

  return (
    <DropdownMenu
      data-testid="neeto-editor-mention-option"
      dropdownProps={{ className: "ne-editor-dropdown min-w-56" }}
      icon={AtSign}
      position={isSecondaryMenu ? "left-start" : "bottom-start"}
      buttonProps={{
        variant: "ghost",
        size: "sm",
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        className: "ne-toolbar-item ne-toolbar-dropdown",
      }}
      customTarget={
        isSecondaryMenu && <SecondaryMenuTarget {...{ label }} icon={AtSign} />
      }
    >
      <Menu>
        {mentions.map(({ key, name, imageUrl }) => (
          <MenuItem
            data-testid={`neeto-editor-mention-option-${key}`}
            key={key}
            prefix={<Avatar size="sm" user={{ name, imageUrl }} />}
            onClick={() => editor.commands.setMention({ id: key, label: name })}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
    </DropdownMenu>
  );
};

export default memo(Mentions);
