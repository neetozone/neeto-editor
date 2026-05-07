import React from "react";

import Menu from "./Menu";

class CommandsList extends React.Component {
  state = { activeMenuIndex: 0 };

  onKeyDown = ({ event }) =>
    ["Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
      event.key
    );

  setActiveMenuIndex = index => this.setState({ activeMenuIndex: index });

  render() {
    return (
      <Menu
        {...this.props}
        activeMenuIndex={this.state.activeMenuIndex}
        items={this.props.items}
        menuIndex={0}
        setActiveMenuIndex={this.setActiveMenuIndex}
      />
    );
  }
}

export default CommandsList;
