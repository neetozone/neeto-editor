import { memo, useState } from "react";

import { Button, DropdownMenu, Input } from "@bigbinary/neeto-atoms";
import { Table } from "lucide-react";
import { withEventTargetValue } from "neetocommons/v2/utils";
import { useTranslation } from "react-i18next";

const { Menu } = DropdownMenu;

const TableOption = ({
  editor,
  tooltipContent,
  isSecondaryMenu = false,
  label,
}) => {
  const { t } = useTranslation();

  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  // Bumping this key remounts DropdownMenu, which closes it after submit.
  // The wrapper exposes onClose for the close direction but no programmatic
  // open control: passing controlled isOpen breaks open clicks (the wrapper's
  // handleOpenChange ignores open events when controlled), and passing
  // onClick to drive isOpen flips the wrapper into SplitTrigger mode
  // (a two-button ButtonGroup) which we don't want here.
  const [resetKey, setResetKey] = useState(0);

  const handleClose = () => {
    setRows(3);
    setColumns(3);
  };

  const handleSubmit = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols: columns, withHeaderRow: true })
      .run();
    handleClose();
    setResetKey(k => k + 1);
  };

  const formContent = (
    <>
      <Input
        autoFocus
        data-testid="neeto-editor-fixed-menu-table-rows-input"
        label={t("neetoEditor.menu.rows")}
        min="1"
        placeholder={t("neetoEditor.placeholders.rows")}
        size="small"
        type="number"
        value={rows}
        onChange={withEventTargetValue(setRows)}
      />
      <Input
        data-testid="neeto-editor-fixed-menu-table-columns-input"
        label={t("neetoEditor.menu.columns")}
        min="1"
        placeholder={t("neetoEditor.placeholders.columns")}
        size="small"
        type="number"
        value={columns}
        onChange={withEventTargetValue(setColumns)}
      />
      <div className="neeto-editor-table-menu__button">
        <Button
          className="mt-auto"
          data-testid="neeto-editor-fixed-menu-table-option-create-button"
          label={t("neetoEditor.common.create")}
          size="sm"
          onClick={handleSubmit}
        />
      </div>
    </>
  );

  if (isSecondaryMenu) {
    return (
      <DropdownMenu.SubMenu
        {...{ label }}
        icon={Table}
        key={resetKey}
        contentProps={{
          className:
            "ne-editor-dropdown neeto-editor-table__item w-auto p-2 flex flex-col",
        }}
        triggerProps={{
          "data-testid": "neeto-editor-fixed-menu-table-option",
        }}
      >
        {formContent}
      </DropdownMenu.SubMenu>
    );
  }

  return (
    <DropdownMenu
      closeOnSelect={false}
      dropdownProps={{ className: "ne-editor-dropdown w-auto p-2" }}
      icon={Table}
      key={resetKey}
      position="bottom"
      buttonProps={{
        tabIndex: -1,
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        variant: "ghost",
        className: "ne-toolbar-item ne-toolbar-dropdown",
        "data-testid": "neeto-editor-fixed-menu-table-option",
      }}
      onClose={handleClose}
    >
      <Menu className="neeto-editor-table__item">{formContent}</Menu>
    </DropdownMenu>
  );
};

export default memo(TableOption);
