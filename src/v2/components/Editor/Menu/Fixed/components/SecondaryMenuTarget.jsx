import { DropdownMenu } from "@bigbinary/neeto-atoms";
import { hyphenate } from "neetocist";

const { MenuItem } = DropdownMenu;

const SecondaryMenuTarget = ({ icon: Icon, label }) => (
  <MenuItem data-testid={`neeto-editor-fixed-menu-${hyphenate(label)}-option`}>
    <Icon /> {label}
  </MenuItem>
);

export default SecondaryMenuTarget;
