import { DropdownMenu } from "@bigbinary/neeto-atoms";
import { Link, Table } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EDITOR_OPTIONS } from "common/constants";
import {
  buildBubbleMenuOptions,
  getNodeIcon,
  getTextMenuDropdownOptions,
  renderOptionButton,
} from "./utils";

import Mentions from "src/v2/components/Editor/CustomExtensions/Mention";
import EmojiOption from "src/v2/components/Editor/Menu/Fixed/components/EmojiOption";
import TextColorOption from "src/v2/components/Editor/Menu/Fixed/components/TextColorOption";

import LinkOption from "./LinkOption";
import TableOption from "./TableOption";

const Options = ({
  editor,
  options,
  mentions,
  tooltips,
  setIsInvalidLink,
  isLinkOptionActive,
  isTableOptionActive,
  setIsLinkOptionActive,
  setIsTableOptionActive,
  setMediaUploader,
  attachmentProps,
  isEmojiPickerActive,
  setIsEmojiPickerActive,
}) => {
  const { t } = useTranslation();
  const { Menu, MenuItem } = DropdownMenu;

  const dropdownOptions = getTextMenuDropdownOptions({ editor, options });
  const Icon = getNodeIcon(dropdownOptions);
  const isEmojiActive = options.includes(EDITOR_OPTIONS.EMOJI);
  const isTextColorOptionActive = options.includes(EDITOR_OPTIONS.TEXT_COLOR);
  const isLinkActive = options.includes(EDITOR_OPTIONS.LINK);
  const isTableActive = options.includes(EDITOR_OPTIONS.TABLE);

  const {
    font: fontStyleOptions,
    block: blockStyleOptions,
    list: listStyleOptions,
  } = buildBubbleMenuOptions({
    editor,
    options,
    setMediaUploader,
    tooltips,
    attachmentProps,
    setIsAddLinkActive: setIsLinkOptionActive,
  });

  const handleAnimateInvalidLink = () => {
    setIsInvalidLink(true);
    setTimeout(() => {
      setIsInvalidLink(false);
    }, 1000);
  };

  if (isLinkOptionActive) {
    return (
      <LinkOption
        {...{ editor, handleAnimateInvalidLink }}
        handleClose={() => setIsLinkOptionActive(false)}
      />
    );
  }

  if (isTableOptionActive) {
    return (
      <TableOption
        {...{ editor }}
        handleClose={() => setIsTableOptionActive(false)}
      />
    );
  }

  return (
    <>
      <DropdownMenu
        icon={Icon}
        buttonProps={{
          "data-testid": "neeto-editor-fixed-menu-font-size-option",
          variant: "ghost",
          className:
            "ne-toolbar-item ne-toolbar-dropdown neeto-editor-font-size__wrapper",
        }}
      >
        <Menu>
          {dropdownOptions.map(({ optionName, command, icon: Icon }) => (
            <MenuItem
              key={optionName}
              prefix={<Icon size={16} />}
              onClick={command}
            >
              {optionName}
            </MenuItem>
          ))}
        </Menu>
      </DropdownMenu>
      {fontStyleOptions.map(renderOptionButton)}
      {blockStyleOptions.map(renderOptionButton)}
      {isTextColorOptionActive && (
        <TextColorOption
          {...{ editor }}
          tooltipContent={tooltips.textColor || t("neetoEditor.menu.textColor")}
        />
      )}
      {isEmojiActive && (
        <EmojiOption
          {...{ editor }}
          isActive={isEmojiPickerActive}
          setActive={setIsEmojiPickerActive}
          tooltipContent={tooltips.emoji || t("neetoEditor.menu.emoji")}
        />
      )}
      {listStyleOptions.map(renderOptionButton)}
      {isLinkActive &&
        renderOptionButton({
          Icon: Link,
          command: () => setIsLinkOptionActive(true),
          active: editor.isActive("link"),
          optionName: "link",
          highlight: false,
          tooltip: tooltips.link || t("neetoEditor.menu.link"),
        })}
      {isTableActive &&
        renderOptionButton({
          Icon: Table,
          command: () => setIsTableOptionActive(true),
          active: editor.isActive("table"),
          optionName: "table",
          highlight: false,
          tooltip: tooltips.table || t("neetoEditor.menu.table"),
        })}
      <Mentions
        {...{ editor, mentions }}
        tooltipContent={tooltips.mention || t("neetoEditor.menu.mention")}
      />
    </>
  );
};

export default Options;
