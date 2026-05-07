import { useEffect, useState } from "react";

import { Button, DropdownMenu, Input } from "@bigbinary/neeto-atoms";
import { Baseline, Check, RotateCw, X } from "lucide-react";
import { withEventTargetValue } from "neetocommons/utils";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";

import SecondaryMenuTarget from "./SecondaryMenuTarget";

const TextColorOption = ({
  editor,
  tooltipContent,
  isSecondaryMenu = false,
  label,
}) => {
  const [color, setColor] = useState(null);
  // Bumping this key remounts the DropdownMenu, which closes it after the
  // user clicks Save / Reset / Cancel. See the analogous comment in
  // TableOption for why we close via remount instead of controlled isOpen.
  const [resetKey, setResetKey] = useState(0);

  const { t } = useTranslation();

  const closeMenu = () => setResetKey(k => k + 1);

  const handleSave = () => {
    editor.chain().focus().setColor(color).run();
    closeMenu();
  };

  const handleUnset = () => {
    editor.chain().focus().unsetColor().run();
    setColor(null);
    closeMenu();
  };

  useEffect(() => {
    setColor(editor.getAttributes("textStyle").color);
  }, [resetKey, editor.getAttributes("textStyle").color]);

  return (
    <DropdownMenu
      closeOnSelect={false}
      dropdownProps={{ className: "ne-editor-dropdown w-[260px] p-2" }}
      icon={Baseline}
      key={resetKey}
      position={isSecondaryMenu ? "left-start" : "bottom-start"}
      buttonProps={{
        variant: color ? "secondary" : "ghost",
        tabIndex: -1,
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        className:
          "ne-toolbar-item ne-toolbar-dropdown neeto-editor-text-color-option",
      }}
      customTarget={
        isSecondaryMenu && (
          <SecondaryMenuTarget {...{ label }} icon={Baseline} />
        )
      }
    >
      <div
        style={{ "min-width": "236px" }}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <HexColorPicker color={color || "#000000"} onChange={setColor} />
        <div className="neeto-editor-text-color-option__options-group">
          <Input
            autoFocus
            className="neeto-editor-text-color-option__options-group__input"
            placeholder={t("neetoEditor.placeholders.pickColor")}
            size="small"
            value={color}
            onChange={withEventTargetValue(setColor)}
            onClick={event => event.stopPropagation()}
          />
          <Button icon={Check} size="sm" onClick={handleSave} />
          <Button
            icon={X}
            size="sm"
            variant="ghost"
            onClick={() => {
              editor.commands.focus();
              closeMenu();
            }}
          />
          <Button
            icon={RotateCw}
            size="sm"
            variant="ghost"
            tooltipProps={{
              content: t("neetoEditor.common.resetToDefault"),
              position: "top",
            }}
            onClick={handleUnset}
          />
        </div>
      </div>
    </DropdownMenu>
  );
};

export default TextColorOption;
