import { memo, useState } from "react";

import { DropdownMenu } from "@bigbinary/neeto-atoms";
import { Smile } from "lucide-react";

import EmojiPickerMenu from "components/Editor/CustomExtensions/Emoji/EmojiPicker/EmojiPickerMenu";

import SecondaryMenuTarget from "./SecondaryMenuTarget";

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

  return (
    <DropdownMenu
      key={resetKey}
      closeOnSelect={false}
      icon={Smile}
      position={isSecondaryMenu ? "left-start" : "bottom-start"}
      buttonProps={{
        variant: "ghost",
        tabIndex: -1,
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        className: "ne-toolbar-item ne-toolbar-dropdown",
        "data-testid": "neeto-editor-fixed-menu-emoji-option",
      }}
      customTarget={
        isSecondaryMenu && <SecondaryMenuTarget {...{ label }} icon={Smile} />
      }
      dropdownProps={{
        className:
          "neeto-editor-fixed-menu__emoji-dropdown min-w-[350px] p-0",
        onClick: e => isSecondaryMenu && e.stopPropagation(),
      }}
      onClose={() => setActive(false)}
    >
      <EmojiPickerMenu {...{ editor, setActive: handlePicked }} />
    </DropdownMenu>
  );
};

export default memo(EmojiOption);
