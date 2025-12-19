import React from "react";

import { Picker } from "emoji-mart";
import PropTypes from "prop-types";

import emojiPickerApi from "apis/emoji_picker";

class EmojiPickerMenu extends React.Component {
  ref = React.createRef();

  componentDidMount() {
    new Picker({
      ...this.props,
      onEmojiSelect: this.handleSelect,
      style: { maxWidth: "100%" },
      theme: "light",
      native: true,
      previewPosition: "none",
      showSkinTones: false,
      data: this.fetchEmojiData,
      ref: this.ref,
    });
  }

  fetchEmojiData = async () => {
    try {
      const { data } = await emojiPickerApi.fetch();

      return data;
    } catch {
      return {};
    }
  };

  onKeyDown = ({ event }) => {
    if (event.key === "Escape") {
      this.props.editor.chain().focus().deleteRange(this.props.range).run();

      return true;
    }

    return false;
  };

  handleSelect = emoji => {
    this.props.editor
      .chain()
      .focus()
      .deleteRange(this.props.range)
      .setEmoji(emoji)
      .run();
    this.props.setActive(false);
  };

  render() {
    return (
      <div
        data-testid="neeto-editor-emoji-picker"
        ref={this.ref}
        style={{ minWidth: "350px" }}
      />
    );
  }
}

EmojiPickerMenu.defaultProps = { editor: {}, range: {} };

EmojiPickerMenu.propTypes = {
  editor: PropTypes.object.isRequired,
  range: PropTypes.object,
};

export default EmojiPickerMenu;
