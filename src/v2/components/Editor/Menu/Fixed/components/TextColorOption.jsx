import { useEffect, useState } from "react";

import { Button, DropdownMenu, Input } from "@bigbinary/neeto-atoms";
import { Baseline, Check, RotateCw, X } from "lucide-react";
import { withEventTargetValue } from "neetocommons/v2/utils";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";

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

  const pickerContent = (
    <div
      style={{ minWidth: "236px" }}
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
  );

  if (isSecondaryMenu) {
    return (
      <DropdownMenu.SubMenu
        {...{ label }}
        contentProps={{ className: "ne-editor-dropdown w-[260px] p-2" }}
        icon={Baseline}
        key={resetKey}
        triggerProps={{
          "data-testid": "neeto-editor-fixed-menu-text-color-option",
        }}
      >
        {pickerContent}
      </DropdownMenu.SubMenu>
    );
  }

  return (
    <DropdownMenu
      closeOnSelect={false}
      dropdownProps={{ className: "ne-editor-dropdown w-[260px] p-2" }}
      icon={Baseline}
      key={resetKey}
      position="bottom-start"
      buttonProps={{
        variant: color ? "secondary" : "ghost",
        tabIndex: -1,
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        className:
          "ne-toolbar-item ne-toolbar-dropdown neeto-editor-text-color-option",
      }}
    >
      {pickerContent}
    </DropdownMenu>
  );
};

export default TextColorOption;
