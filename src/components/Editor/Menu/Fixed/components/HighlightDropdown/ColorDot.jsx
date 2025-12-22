import classNames from "classnames";
import { hyphenize } from "neetocommons/utils";
import { Typography } from "neetoui";

const ColorDot = ({ colorVar, isSelected, onClick, isTextColor }) => {
  const dotClass = classNames("neeto-editor-highlight-dropdown__color-dot", {
    "neeto-editor-highlight-dropdown__color-dot--selected": isSelected,
    "neeto-editor-highlight-dropdown__color-dot--background": !isTextColor,
  });

  const dotStyle = {
    ...(isTextColor
      ? { color: `var(${colorVar})` }
      : { backgroundColor: `var(${colorVar})` }),
  };

  const colorNumber = colorVar.match(/\d+$/)?.[0] || colorVar;

  return (
    <div
      {...{ onClick }}
      className={dotClass}
      style={dotStyle}
      data-testid={`neeto-editor-highlight-${hyphenize(
        isTextColor ? "text" : "background"
      )}-color-dot-${colorNumber}`}
    >
      {isTextColor && (
        <Typography
          className="neeto-editor-highlight-dropdown__color-dot-text"
          style="body2"
          weight="semibold"
        >
          A
        </Typography>
      )}
    </div>
  );
};

export default ColorDot;
