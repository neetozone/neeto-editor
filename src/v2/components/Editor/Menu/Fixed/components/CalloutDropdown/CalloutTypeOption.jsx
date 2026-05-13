import { DropdownMenu } from "@bigbinary/neeto-atoms";

const { MenuItem } = DropdownMenu;

const CalloutTypeOption = ({ calloutType, isSelected, onClick }) => {
  const Icon = calloutType.icon;

  return (
    <MenuItem
      {...{ onClick }}
      data-testid="callout-type-option"
      isActive={isSelected}
      prefix={<Icon size={16} style={{ stroke: calloutType.iconColor }} />}
    >
      {calloutType.label}
    </MenuItem>
  );
};

export default CalloutTypeOption;
