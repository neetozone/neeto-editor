import { memo } from "react";

import { Smiley } from "neetoicons";
import { Dropdown } from "neetoui";

import SecondaryMenuTarget from "./SecondaryMenuTarget";

import EmojiPickerMenu from "../../../CustomExtensions/Emoji/EmojiPicker/EmojiPickerMenu";

const EmojiOption = ({
  editor,
  isActive,
  setActive,
  tooltipContent,
  isSecondaryMenu = false,
  label,
}) => (
  <Dropdown
    buttonStyle="text"
    closeOnSelect={false}
    icon={Smiley}
    isOpen={isActive}
    position={isSecondaryMenu ? "left-start" : "bottom-start"}
    strategy="fixed"
    buttonProps={{
      tabIndex: -1,
      tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
      className: "neeto-editor-fixed-menu__item",
      "data-testid": "neeto-editor-fixed-menu-emoji-option",
    }}
    customTarget={
      isSecondaryMenu && <SecondaryMenuTarget {...{ label }} icon={Smiley} />
    }
    dropdownProps={{
      classNames: "neeto-editor-fixed-menu__emoji-dropdown",
      onClick: e => isSecondaryMenu && e.stopPropagation(),
    }}
    onClose={() => setActive(false)}
    onClick={e => {
      setActive(active => !active);
      isSecondaryMenu && e.stopPropagation();
    }}
  >
    <EmojiPickerMenu {...{ editor, setActive }} />
  </Dropdown>
);

export default memo(EmojiOption);
