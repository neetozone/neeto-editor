import classNames from "classnames";
import { hyphenize } from "neetocommons/utils";

const ColorDot = ({ colorVar, isSelected, onClick, isTextColor }) => {
  const dotClass = classNames("neeto-editor-highlight-dropdown__color-dot", {
    "neeto-editor-highlight-dropdown__color-dot--selected": isSelected,
  });

  const dotStyle = { backgroundColor: `var(${colorVar})` };

  const colorNumber = colorVar.match(/\d+$/)?.[0] || colorVar;

  return (
    <div
      {...{ onClick }}
      className={dotClass}
      style={dotStyle}
      data-testid={`neeto-editor-highlight-${hyphenize(
        isTextColor ? "text" : "background"
      )}-color-dot-${colorNumber}`}
    />
  );
};

export default ColorDot;
