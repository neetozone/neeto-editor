import React from "react";

import { Avatar, Typography } from "@bigbinary/neeto-atoms";
import classNames from "classnames";
import { t } from "i18next";
import { isEmpty } from "ramda";

import { scrollHandler } from "utils/scrollhandler";

export class MentionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedIndex: 0 };
    this.mentionRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { items } = this.props;
    if (items !== prevProps.items) {
      this.setState({ selectedIndex: 0 });
    }

    scrollHandler({
      wrapperRef: this.mentionRef,
      index: this.state.selectedIndex,
    });
  }

  selectItem = index => {
    const { items, command } = this.props;
    const item = items[index];

    if (item) {
      command({ label: item.name, id: item.key });
    }
  };

  upHandler = () => {
    const { items } = this.props;
    this.setState(prevState => {
      const { selectedIndex } = prevState;
      const nextSelectedIndex =
        (selectedIndex + items.length - 1) % items.length;

      return { selectedIndex: nextSelectedIndex };
    });
  };

  downHandler = () => {
    const { items } = this.props;
    this.setState(prevState => {
      const { selectedIndex } = prevState;
      const nextSelectedIndex = (selectedIndex + 1) % items.length;

      return { selectedIndex: nextSelectedIndex };
    });
  };

  enterHandler = () => {
    const { selectedIndex } = this.state;
    this.selectItem(selectedIndex);
  };

  tabHandler = () => {
    const { selectedIndex } = this.state;
    this.selectItem(selectedIndex);
  };

  onKeyDown = ({ event }) => {
    const keyDownHandlers = {
      ArrowUp: this.upHandler,
      ArrowDown: this.downHandler,
      Enter: this.enterHandler,
      Tab: this.tabHandler,
    };

    if (Object.prototype.hasOwnProperty.call(keyDownHandlers, event.key)) {
      keyDownHandlers[event.key]();

      return true;
    }

    return false;
  };

  render() {
    const { selectedIndex } = this.state;
    const { items } = this.props;

    if (isEmpty(items)) {
      return (
        <div className="neeto-editor-mentions__wrapper">
          <p className="neeto-editor-mentions__item">
            {t("neetoEditor.error.noResults")}
          </p>
        </div>
      );
    }

    // Plain <button>s instead of `DropdownMenu.MenuItem`. The popup is portaled
    // into document.body by tippy, so it sits outside any `DropdownMenu` Root
    // — Radix's `MenuItem` would call `useMenuScope` and throw
    // "MenuItem must be used within Menu". Styling lives in _v2-toolbar.scss
    // under `.neeto-editor-mentions__wrapper` / `__item`.
    return (
      <div
        className="neeto-editor-mentions__wrapper"
        data-testid="neeto-editor-mention-list"
        ref={this.mentionRef}
      >
        {items.map(({ key, name, imageUrl }, index) => (
          <button
            data-testid={`neeto-editor-mention-list-${name}`}
            key={key}
            type="button"
            className={classNames("neeto-editor-mentions__item", {
              active: index === selectedIndex,
            })}
            onClick={() => this.selectItem(index)}
          >
            <Avatar size="sm" user={{ name, imageUrl }} />
            <Typography variant="body2">{name}</Typography>
          </button>
        ))}
      </div>
    );
  }
}
