import { memo } from "react";

import { Email } from "neetoicons";
import { Avatar, Dropdown, Typography } from "neetoui";
import { isEmpty } from "ramda";

import SecondaryMenuTarget from "components/Editor/Menu/Fixed/components/SecondaryMenuTarget";

const { Menu, MenuItem } = Dropdown;

const Mentions = ({
  editor,
  mentions,
  tooltipContent,
  isSecondaryMenu = false,
  label,
}) => {
  if (isEmpty(mentions)) return null;

  return (
    <Dropdown
      buttonStyle="text"
      data-testid="neeto-editor-mention-option"
      icon={Email}
      position={isSecondaryMenu ? "left-start" : "bottom-start"}
      strategy="fixed"
      buttonProps={{
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        className: "neeto-editor-fixed-menu__item",
      }}
      customTarget={
        isSecondaryMenu && <SecondaryMenuTarget {...{ label }} icon={Email} />
      }
      onClick={e => isSecondaryMenu && e.stopPropagation()}
    >
      <Menu>
        {mentions.map(({ key, name, imageUrl }) => (
          <MenuItem.Button
            data-testid={`neeto-editor-mention-option-${key}`}
            key={key}
            onClick={() => editor.commands.setMention({ id: key, label: name })}
          >
            <Avatar size="small" user={{ name, imageUrl }} />
            <Typography style="body2">{name}</Typography>
          </MenuItem.Button>
        ))}
      </Menu>
    </Dropdown>
  );
};

export default memo(Mentions);
