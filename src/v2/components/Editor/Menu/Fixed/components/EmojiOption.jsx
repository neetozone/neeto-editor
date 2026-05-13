import { memo, useState } from "react";

import { DropdownMenu } from "@bigbinary/neeto-atoms";
import { Smile } from "lucide-react";

import EmojiPickerMenu from "src/v2/components/Editor/CustomExtensions/Emoji/EmojiPicker/EmojiPickerMenu";

const EmojiOption = ({
  editor,
  setActive,
  tooltipContent,
  isSecondaryMenu = false,
  label,
}) => {
  // Bumping this key remounts the DropdownMenu, which closes it after an
  // emoji is picked. The wrapper exposes onClose for the close direction
  // but no programmatic close, and going controlled via isOpen + onClick
  // flips the wrapper into SplitTrigger mode (a two-button ButtonGroup).
  const [resetKey, setResetKey] = useState(0);

  const handlePicked = () => {
    setActive(false);
    setResetKey(k => k + 1);
  };

  if (isSecondaryMenu) {
    return (
      <DropdownMenu.SubMenu
        {...{ label }}
        icon={Smile}
        key={resetKey}
        contentProps={{
          className:
            "ne-editor-dropdown neeto-editor-fixed-menu__emoji-dropdown min-w-[350px] p-0",
        }}
        triggerProps={{
          "data-testid": "neeto-editor-fixed-menu-emoji-option",
        }}
      >
        <EmojiPickerMenu {...{ editor }} setActive={handlePicked} />
      </DropdownMenu.SubMenu>
    );
  }

  return (
    <DropdownMenu
      closeOnSelect={false}
      icon={Smile}
      key={resetKey}
      position="bottom-start"
      buttonProps={{
        variant: "ghost",
        tabIndex: -1,
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        className: "ne-toolbar-item ne-toolbar-dropdown",
        "data-testid": "neeto-editor-fixed-menu-emoji-option",
      }}
      dropdownProps={{
        className:
          "ne-editor-dropdown neeto-editor-fixed-menu__emoji-dropdown min-w-[350px] p-0",
      }}
      onClose={() => setActive(false)}
    >
      <EmojiPickerMenu {...{ editor }} setActive={handlePicked} />
    </DropdownMenu>
  );
};

export default memo(EmojiOption);
