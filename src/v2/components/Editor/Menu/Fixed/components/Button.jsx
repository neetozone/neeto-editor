import { memo } from "react";

import { Button } from "@bigbinary/neeto-atoms";

import useEditorStore from "src/stores/useEditorStore";
import { generateFocusProps } from "utils/focusHighlighter";

import { renderTooltipContent } from "../utils";

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
      className="ne-toolbar-item"
      data-testid={`neeto-editor-fixed-menu-${optionName}-option`}
      tabIndex="-1"
      variant={isActive ? "secondary" : "ghost"}
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
