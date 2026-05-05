import { memo } from "react";

import { Avatar, DropdownMenu, Typography } from "@bigbinary/neeto-atoms";
import { Mail } from "lucide-react";
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
      icon={Mail}
      position={isSecondaryMenu ? "left-start" : "bottom-start"}
      buttonProps={{
        variant: "ghost",
        size: "sm",
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        className: "ne-toolbar-item",
      }}
      customTarget={
        isSecondaryMenu && <SecondaryMenuTarget {...{ label }} icon={Mail} />
      }
      dropdownProps={{ className: "ne-editor-dropdown" }}
    >
      <Menu>
        {mentions.map(({ key, name, imageUrl }) => (
          <MenuItem
            data-testid={`neeto-editor-mention-option-${key}`}
            key={key}
            onClick={() => editor.commands.setMention({ id: key, label: name })}
          >
            <Avatar size="sm" user={{ name, imageUrl }} />
            <Typography variant="body2">{name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </DropdownMenu>
  );
};

export default memo(Mentions);
