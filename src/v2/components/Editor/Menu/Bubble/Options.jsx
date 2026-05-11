import { Button } from "@bigbinary/neeto-atoms";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@bigbinary/neeto-atoms/primitives/Popover";
import { EDITOR_OPTIONS } from "common/constants";
import { ChevronDown, Link, Table } from "lucide-react";
import { useTranslation } from "react-i18next";

import Mentions from "src/v2/components/Editor/CustomExtensions/Mention";
import EmojiOption from "src/v2/components/Editor/Menu/Fixed/components/EmojiOption";
import TextColorOption from "src/v2/components/Editor/Menu/Fixed/components/TextColorOption";

import LinkOption from "./LinkOption";
import TableOption from "./TableOption";
import {
  buildBubbleMenuOptions,
  getNodeIcon,
  getTextMenuDropdownOptions,
  renderOptionButton,
} from "./utils";

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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="ne-toolbar-item ne-toolbar-dropdown neeto-editor-font-size__wrapper"
            data-testid="neeto-editor-fixed-menu-font-size-option"
            icon={Icon}
            iconPosition="left"
            trailing={<ChevronDown />}
            variant="ghost"
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="ne-editor-dropdown data-[state=closed]:hidden w-32 gap-0 p-1"
          side="bottom"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          {dropdownOptions.map(({ optionName, command, icon: Icon }) => (
            <Button
              fullWidth
              className="justify-start"
              icon={<Icon size={16} />}
              iconPosition="left"
              key={optionName}
              label={optionName}
              size="sm"
              variant="ghost"
              onClick={command}
            />
          ))}
        </PopoverContent>
      </Popover>
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
