import React from "react";

import classnames from "classnames";
import { init, SearchIndex } from "emoji-mart";
import { isNotEmpty } from "neetocist";
import { Spinner } from "neetoui";
import { isEmpty } from "ramda";

import emojiPickerApi from "apis/emoji_picker";

import { filterEmojiSuggestions } from "./utils";

class EmojiSuggestionMenu extends React.Component {
  state = {
    isLoading: false,
    selectedIndex: 0,
    emojiSuggestions: [],
    frequentlyUsedEmojis: {},
  };

  componentDidMount() {
    this.setState({
      frequentlyUsedEmojis: Object.keys(
        JSON.parse(localStorage.getItem("emoji-mart.frequently") || "{}")
      ),
    });

    init({
      data: this.fetchEmojiData,
      theme: "light",
      previewPosition: "none",
    });
    this.searchEmojiAndSetState();
  }

  componentDidUpdate(oldProps) {
    if (this.props.query !== oldProps.query) {
      this.searchEmojiAndSetState();
    }
  }

  fetchEmojiData = async () => {
    this.setState({ isLoading: true });
    try {
      const { data } = await emojiPickerApi.fetch();
      this.setState({ isLoading: false });

      return data;
    } catch {
      this.setState({ isLoading: false });

      return {};
    }
  };

  searchEmoji = async () =>
    this.props.query ? SearchIndex.search(this.props.query) : [];

  searchEmojiAndSetState = async () => {
    try {
      const suggestions = await this.searchEmoji();
      const frequentlyUsedEmojis = this.state.frequentlyUsedEmojis;
      this.setState({
        emojiSuggestions: filterEmojiSuggestions(
          suggestions,
          frequentlyUsedEmojis
        ),
      });
    } catch {
      this.setState({ emojiSuggestions: [] });
    }
  };

  setEditorState = async () => {
    const suggestions = await this.searchEmoji();
    this.props.editor
      .chain()
      .focus()
      .deleteRange(this.props.range)
      .setEmoji(suggestions[0])
      .run();
  };

  onKeyDown = ({ event }) => {
    if (isEmpty(this.state.emojiSuggestions)) {
      return false;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      this.setState(({ selectedIndex, emojiSuggestions }) => ({
        selectedIndex:
          (selectedIndex + emojiSuggestions.length - 1) %
          emojiSuggestions.length,
      }));

      return true;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      this.setState(({ selectedIndex, emojiSuggestions }) => ({
        selectedIndex: (selectedIndex + 1) % emojiSuggestions.length,
      }));

      return true;
    }

    if (event.key === "Enter") {
      this.selectItem(this.state.selectedIndex);

      return true;
    }

    if (event.key === "Escape") {
      this.props.editor.chain().focus().insertContent(" ").run();

      return true;
    }

    return false;
  };

  selectItem = index => {
    this.props.editor
      .chain()
      .focus()
      .deleteRange(this.props.range)
      .setEmoji(this.state.emojiSuggestions[index])
      .run();
  };

  render() {
    if (isEmpty(this.state.emojiSuggestions)) {
      return null;
    }

    return (
      <div className="neeto-editor-emoji-suggestion">
        {this.state.isLoading && <Spinner />}
        {!this.state.isLoading &&
          (isNotEmpty(this.state.emojiSuggestions) ? (
            this.state.emojiSuggestions.map((emoji, index) => (
              <div
                data-testid={`neeto-editor-emoji-suggestion-${emoji.id}`}
                key={emoji.id}
                className={classnames("neeto-editor-emoji-suggestion__item", {
                  "neeto-editor-emoji-suggestion__item--selected":
                    index === this.state.selectedIndex,
                })}
                onClick={() => this.selectItem(index)}
              >
                {emoji.skins[0].native}
              </div>
            ))
          ) : (
            <p>No results</p>
          ))}
      </div>
    );
  }
}

export default EmojiSuggestionMenu;
