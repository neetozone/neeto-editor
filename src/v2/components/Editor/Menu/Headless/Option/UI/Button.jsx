import { Tooltip } from "@bigbinary/neeto-atoms";
import classnames from "classnames";
import { noop } from "neetocist";

const Button = ({
  icon = null,
  onClick = noop,
  disabled = false,
  className,
  tooltipProps,
  ...otherProps
}) => {
  const Icon = icon;

  return (
    <Tooltip
      disabled={!tooltipProps}
      onClick={() => onClick()}
      {...tooltipProps}
    >
      <button
        className={classnames("ne-headless-btn", { [className]: className })}
        type="button"
        {...{ disabled, onClick, ...otherProps }}
      >
        {icon && <Icon aria-hidden="true" key="2" size={18} />}
      </button>
    </Tooltip>
  );
};

export default Button;
