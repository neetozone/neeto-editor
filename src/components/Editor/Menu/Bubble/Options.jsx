import { EDITOR_OPTIONS } from "common/constants";
import { Link, Column, Down } from "neetoicons";
import { Dropdown } from "neetoui";
import { useTranslation } from "react-i18next";

import LinkOption from "./LinkOption";
import TableOption from "./TableOption";
import {
  getNodeIcon,
  getTextMenuDropdownOptions,
  renderOptionButton,
  buildBubbleMenuOptions,
} from "./utils";

import Mentions from "../../CustomExtensions/Mention";
import EmojiOption from "../Fixed/components/EmojiOption";
import TextColorOption from "../Fixed/components/TextColorOption";

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
  const { Menu, MenuItem } = Dropdown;

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
      <Dropdown
        buttonSize="small"
        buttonStyle="text"
        label={Icon}
        strategy="fixed"
        buttonProps={{
          icon: Icon,
          iconPosition: "left",
          iconSize: 22,
          label: <Down size={12} />,
          "data-testid": "neeto-editor-fixed-menu-font-size-option",
          style: "text",
          size: "small",
          className:
            "neeto-editor-bubble-menu__item neeto-editor-font-size__wrapper",
        }}
      >
        <Menu className="neeto-ui-flex neeto-ui-gap-1 neeto-editor-menu-font-size-options">
          {dropdownOptions.map(({ optionName, command, icon: Icon }) => (
            <MenuItem.Button
              className="neeto-editor-menu-font-size-options__item-btn"
              key={optionName}
              tooltipProps={{ content: optionName, position: "bottom" }}
              onClick={command}
            >
              <Icon size={22} />
            </MenuItem.Button>
          ))}
        </Menu>
      </Dropdown>
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
          Icon: Column,
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
