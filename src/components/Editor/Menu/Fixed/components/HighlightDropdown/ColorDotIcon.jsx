import classNames from "classnames";
import { Typography } from "neetoui";

const ColorDotIcon = ({ textColor, backgroundColor }) => {
  const dotClass = classNames("neeto-editor-highlight-dropdown__color-dot", {});

  const dotStyle = {
    color: `var(${textColor})`,
    backgroundColor: `var(${backgroundColor})`,
  };

  return (
    <div className={dotClass} style={dotStyle}>
      <Typography
        className="neeto-editor-highlight-dropdown__color-dot-text"
        style="body2"
        weight="semibold"
      >
        A
      </Typography>
    </div>
  );
};

export default ColorDotIcon;
