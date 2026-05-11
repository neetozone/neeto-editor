import CalloutTypeOption from "./CalloutTypeOption";
import { CALLOUT_TYPES } from "./constants";

const RenderCalloutOptions = ({
  isInCallout,
  currentCalloutAttrs,
  handleCalloutTypeClick,
}) =>
  CALLOUT_TYPES.map((calloutType, idx) => (
    <CalloutTypeOption
      {...{ calloutType }}
      isSelected={isInCallout && currentCalloutAttrs?.type === calloutType.type}
      key={idx}
      onClick={() => handleCalloutTypeClick(calloutType)}
    />
  ));

export default RenderCalloutOptions;
