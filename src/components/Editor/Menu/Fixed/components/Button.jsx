import { memo } from "react";

import { Button } from "neetoui";

import useEditorStore from "src/stores/useEditorStore";
import { generateFocusProps } from "utils/focusHighlighter";

import { renderTooltipContent } from "../utils.js";

const MenuButton = ({
  icon,
  command,
  optionName,
  highlight,
  disabled: isButtonDisabled = false,
  label,
}) => {
  const { isActive, disabled = isButtonDisabled } = useEditorStore.pick([
    "marksState",
    optionName,
  ]);

  return (
    <Button
      {...{ disabled, icon }}
      className="neeto-editor-fixed-menu__item"
      data-testid={`neeto-editor-fixed-menu-${optionName}-option`}
      style={isActive ? "secondary" : "text"}
      tabIndex="-1"
      tooltipProps={{
        content: renderTooltipContent(label, optionName),
        position: "bottom",
      }}
      onClick={command}
      {...generateFocusProps(highlight)}
    />
  );
};

export default memo(MenuButton);
