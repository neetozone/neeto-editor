import { Smile } from "lucide-react";

import EmojiPicker from "src/v2/components/Editor/CustomExtensions/Emoji/EmojiPicker/EmojiPickerMenu";

import Dropdown from "./UI/Dropdown";

const Emoji = ({ editor, isActive, setActive, tooltipContent }) => (
  <Dropdown
    className="ne-headless__emoji"
    icon={Smile}
    isOpen={isActive}
    buttonProps={{
      tooltipProps: {
        content: tooltipContent,
        delay: [500],
        position: "bottom",
      },
      "data-testid": "ne-emoji-picker",
    }}
    onClick={() => setActive(active => !active)}
    onClose={() => setActive(false)}
  >
    <EmojiPicker {...{ editor, setActive }} />
  </Dropdown>
);
export default Emoji;
