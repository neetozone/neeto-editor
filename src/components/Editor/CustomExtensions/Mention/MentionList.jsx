import React from "react";

import classNames from "classnames";
import { t } from "i18next";
import { Avatar, Dropdown, Typography } from "neetoui";
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
    const { Menu, MenuItem } = Dropdown;

    if (isEmpty(items)) {
      return (
        <div className="neeto-editor-mentions__wrapper">
          <p className="neeto-editor-mentions__item">
            {t("neetoEditor.error.noResults")}
          </p>
        </div>
      );
    }

    return (
      <div className="neeto-ui-dropdown__popup">
        <Menu
          className="neeto-editor-mentions__wrapper"
          data-testid="neeto-editor-mention-list"
          ref={this.mentionRef}
        >
          {items.map(({ key, name, imageUrl }, index) => (
            <MenuItem.Button
              data-testid={`neeto-editor-mention-list-${name}`}
              key={key}
              type="button"
              className={classNames("neeto-editor-mentions__item", {
                active: index === selectedIndex,
              })}
              onClick={() => this.selectItem(index)}
            >
              <Avatar size="small" user={{ name, imageUrl }} />
              <Typography style="body2">{name}</Typography>
            </MenuItem.Button>
          ))}
        </Menu>
      </div>
    );
  }
}
