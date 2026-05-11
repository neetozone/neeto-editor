import React, { forwardRef } from "react";

import Tippy from "@tippyjs/react";
import classnames from "classnames";
import { isNotPresent } from "neetocist";

import { scrollHandler } from "utils/scrollhandler";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: 0 };
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    const { menuIndex, activeMenuIndex } = this.props;
    const isCurrentMenuActive = menuIndex === activeMenuIndex;
    if (isCurrentMenuActive) {
      document.addEventListener("keydown", this.keydownHandler);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownHandler);
  }

  componentDidUpdate(oldProps) {
    const { items, menuIndex, activeMenuIndex } = this.props;
    const isCurrentMenuActive = menuIndex === activeMenuIndex;

    if (items !== oldProps.items) this.setState({ selectedIndex: 0 });

    scrollHandler({
      wrapperRef: this.menuRef,
      index: this.state.selectedIndex,
    });

    if (isCurrentMenuActive) {
      document.addEventListener("keydown", this.keydownHandler);
    } else document.removeEventListener("keydown", this.keydownHandler);
  }

  keydownHandler = event => {
    const listeners = {
      Enter: this.enterHandler,
      ArrowUp: this.upHandler,
      ArrowDown: this.downHandler,
      ArrowLeft: this.leftArrowHandler,
      ArrowRight: this.rightArrowHandler,
    };

    if (event.key in listeners) listeners[event.key](event);
  };

  selectItem = index => {
    const { items, editor, range } = this.props;
    const selectedItem = items[index];
    const hasCommand = selectedItem && selectedItem.command;
    if (hasCommand) selectedItem.command({ editor, range });
  };

  upHandler = () => {
    const { items } = this.props;
    const { selectedIndex } = this.state;
    this.setState({
      selectedIndex: (selectedIndex + items.length - 1) % items.length,
    });
  };

  downHandler = () => {
    const { items } = this.props;
    const { selectedIndex } = this.state;
    this.setState({ selectedIndex: (selectedIndex + 1) % items.length });
  };

  enterHandler = () => {
    const { selectedIndex } = this.state;
    this.selectItem(selectedIndex);
  };

  leftArrowHandler = () => {
    const { menuIndex, setActiveMenuIndex } = this.props;
    if (menuIndex > 0) setActiveMenuIndex(menuIndex - 1);
  };

  rightArrowHandler = () => {
    const { menuIndex, setActiveMenuIndex, items } = this.props;
    const { selectedIndex } = this.state;
    const selectedItem = items[selectedIndex];
    const hasSubItems = selectedItem && !isNotPresent(selectedItem.items);
    if (hasSubItems) setActiveMenuIndex(menuIndex + 1);
  };

  render() {
    const { items, menuIndex, activeMenuIndex } = this.props;
    const { selectedIndex } = this.state;
    const isCurrentMenuActive = menuIndex === activeMenuIndex;

    return (
      <div
        className="neeto-editor-slash-commands__wrapper"
        data-testid="neeto-editor-slash-commands-wrapper"
        ref={this.menuRef}
      >
        {items.map((item, index) => {
          const isLeafNode = isNotPresent(item.items);

          const nodeElement = (
            <MenuItem
              {...{ index, item }}
              key={item.optionName}
              selectItem={() => this.selectItem(index)}
              selectedIndex={isCurrentMenuActive ? selectedIndex : -1}
              onHover={() => this.setState({ selectedIndex: index })}
            />
          );

          if (isLeafNode) return nodeElement;

          return (
            <Tippy
              interactive
              key={item.optionName}
              placement="right"
              theme="light neeto-editor-slash-commands-tippy"
              visible={selectedIndex === index}
              content={
                <Menu
                  {...this.props}
                  items={item.items}
                  menuIndex={menuIndex + 1}
                />
              }
              onCreate={({ popper }) => (popper.style.width = "max-content")}
              onHide={() => {
                this.isSubmenuOpened = false;
              }}
              onShow={() => {
                this.isSubmenuOpened = true;
              }}
            >
              {nodeElement}
            </Tippy>
          );
        })}
      </div>
    );
  }
}

// eslint-disable-next-line react/display-name
const MenuItem = forwardRef(
  ({ item, selectedIndex, index, selectItem, onHover }, ref) => {
    const { Icon } = item;

    return (
      <button
        {...{ ref }}
        data-testid={`neeto-editor-command-list-item-${index}`}
        className={classnames("neeto-editor-slash-commands__item", {
          active: index === selectedIndex,
        })}
        onClick={selectItem}
        onMouseEnter={onHover}
      >
        {Icon && <Icon size={20} />}
        <span className="neeto-editor-slash-commands__item-content">
          <span
            className="neeto-editor-slash-commands__item-title"
            data-testid="neeto-editor-command-list-item-block-heading"
          >
            {item.title}
          </span>
        </span>
      </button>
    );
  }
);

export default Menu;
