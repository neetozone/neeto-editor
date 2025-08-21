import classnames from "classnames";
import { EDITOR_OPTIONS } from "common/constants";

import MediaUploader from "components/Editor/MediaUploader";

import Option from "./Option";
import { buildOptionsFromAddonCommands, buildMenuOptions } from "./utils";

const Headless = ({
  editor,
  options,
  tooltips = {},
  setMediaUploader,
  mediaUploader,
  addonCommands = [],
  className,
  attachmentProps,
  isEmojiPickerActive,
  setIsEmojiPickerActive,
}) => {
  if (!editor) {
    return null;
  }

  const isMediaUploaderActive =
    options.includes(EDITOR_OPTIONS.IMAGE_UPLOAD) ||
    options.includes(EDITOR_OPTIONS.VIDEO_UPLOAD);

  const menuOptions = buildMenuOptions({
    tooltips,
    editor,
    options,
    setMediaUploader,
    attachmentProps,
    isEmojiPickerActive,
    setIsEmojiPickerActive,
  });

  const addonCommandOptions = buildOptionsFromAddonCommands({
    editor,
    commands: addonCommands,
  });
  const allOptions = [...menuOptions, ...addonCommandOptions];

  return (
    <div className={classnames("ne-headless", { [className]: className })}>
      {allOptions.map(option => (
        <Option {...{ editor }} key={option.optionName} {...option} />
      ))}
      {isMediaUploaderActive && (
        <MediaUploader
          {...{ editor, mediaUploader }}
          onClose={() => setMediaUploader({ image: false, video: false })}
        />
      )}
    </div>
  );
};

export default Headless;
