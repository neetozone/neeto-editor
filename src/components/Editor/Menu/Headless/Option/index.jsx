import classnames from "classnames";
import { EDITOR_OPTIONS } from "common/constants";
import { hyphenate } from "neetocist";

import Emoji from "./Emoji";
import Button from "./UI/Button";

const Option = ({
  editor,
  optionName,
  command,
  disabled,
  Icon,
  isActive,
  setActive,
  tooltip,
}) => {
  if (optionName === EDITOR_OPTIONS.EMOJI) {
    return (
      <Emoji
        {...{ editor, isActive, setActive }}
        tooltipContent={tooltip || "Emoji"}
      />
    );
  }

  return (
    <Button
      {...{ disabled }}
      className={classnames({ "ne-headless-btn--active": isActive })}
      data-testid={hyphenate(optionName)}
      icon={Icon}
      tooltipProps={{
        content: tooltip,
        delay: [500],
        position: "bottom",
      }}
      onClick={command}
    />
  );
};

export default Option;
