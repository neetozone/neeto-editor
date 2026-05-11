import { Flag } from "lucide-react";

const CalloutIcon = ({ currentType }) => {
  if (currentType?.icon) {
    const Icon = currentType.icon;

    return (
      <span className="neeto-editor-callout-dropdown__current-emoji">
        <Icon size={22} />
      </span>
    );
  }

  return <Flag size={16} />;
};

export default CalloutIcon;
