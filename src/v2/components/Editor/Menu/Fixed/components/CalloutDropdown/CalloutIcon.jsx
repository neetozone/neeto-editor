import { Flag } from "lucide-react";

const CalloutIcon = ({ currentType }) => {
  const Icon = currentType?.icon ?? Flag;

  return <Icon size={16} />;
};

export default CalloutIcon;
