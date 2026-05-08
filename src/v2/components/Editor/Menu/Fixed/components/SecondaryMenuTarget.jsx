import { DropdownMenu } from "@bigbinary/neeto-atoms";
import { hyphenate } from "neetocist";

const { MenuItem } = DropdownMenu;

const SecondaryMenuTarget = ({ icon: Icon, label }) => (
  <MenuItem
    data-testid={`neeto-editor-fixed-menu-${hyphenate(label)}-option`}
    prefix={<Icon size={16} />}
  >
    {label}
  </MenuItem>
);

export default SecondaryMenuTarget;
