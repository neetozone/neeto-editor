import { useState } from "react";

import Tippy from "@tippyjs/react";
import classnames from "classnames";
import { noop } from "neetocist";

import Button from "./Button";

const hideOnEsc = {
  name: "hideOnEsc",
  defaultValue: true,
  fn({ hide, props: { hideOnEsc, onClose } }) {
    function onKeyDown(event) {
      if (!(event.key.toLowerCase() === "escape" && hideOnEsc)) return;
      onClose();
      hide();
    }

    return {
      onShow() {
        document.addEventListener("keydown", onKeyDown);
      },
      onHide() {
        document.removeEventListener("keydown", onKeyDown);
      },
    };
  },
};

const Dropdown = ({
  icon,
  isOpen,
  onClose = noop,
  children,
  className,
  onClick,
  buttonProps = {},
  ...otherProps
}) => {
  const [mounted, setMounted] = useState(false);

  return (
    <Tippy
      {...{ onClose }}
      hideOnEsc
      interactive
      animation={false}
      arrow={false}
      duration={0}
      hideOnClick={false}
      maxWidth="none"
      offset={0}
      plugins={[hideOnEsc]}
      popperOptions={{ strategy: "fixed" }}
      role="dropdown"
      theme="light"
      trigger="click"
      visible={isOpen}
      className={classnames("ne-headless-dropdown", {
        [className]: className,
      })}
      content={
        mounted && <div className="ne-headless-dropdown__popup">{children}</div>
      }
      onClickOutside={onClose}
      onHidden={() => setMounted(false)}
      onMount={() => setMounted(true)}
      {...otherProps}
    >
      <span>
        <Button {...{ icon, onClick, ...buttonProps }} />
      </span>
    </Tippy>
  );
};

export default Dropdown;
