import { DropdownMenu } from "@bigbinary/neeto-atoms";

const { MenuItem } = DropdownMenu;

const CalloutTypeOption = ({ calloutType, isSelected, onClick }) => {
  const Icon = calloutType.icon;

  return (
    <MenuItem
      data-testid="callout-type-option"
      isActive={isSelected}
      prefix={<Icon size={16} />}
      onClick={onClick}
    >
      {calloutType.label}
    </MenuItem>
  );
};

export default CalloutTypeOption;
