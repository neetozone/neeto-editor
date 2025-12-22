import { memo, useState } from "react";

import { withEventTargetValue } from "neetocommons/utils";
import { Column } from "neetoicons";
import { Button, Dropdown, Input } from "neetoui";
import { not } from "ramda";
import { useTranslation } from "react-i18next";

import SecondaryMenuTarget from "./SecondaryMenuTarget";

const { Menu } = Dropdown;

const TableOption = ({
  editor,
  tooltipContent,
  isSecondaryMenu = false,
  label,
}) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const handleClose = () => {
    setRows(3);
    setColumns(3);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols: columns, withHeaderRow: true })
      .run();
    handleClose();
  };

  const handleDropdownClick = e => {
    isSecondaryMenu && e.stopPropagation();
    setIsOpen(not);
  };

  return (
    <Dropdown
      {...{ isOpen }}
      buttonStyle={isOpen ? "secondary" : "text"}
      closeOnSelect={false}
      data-testid="neeto-editor-fixed-menu-link-option"
      icon={Column}
      position={isSecondaryMenu ? "left-start" : "bottom"}
      buttonProps={{
        tabIndex: -1,
        tooltipProps: { content: tooltipContent ?? label, position: "bottom" },
        className: "neeto-editor-fixed-menu__item",
        "data-testid": "neeto-editor-fixed-menu-table-option",
      }}
      customTarget={
        isSecondaryMenu && <SecondaryMenuTarget {...{ label }} icon={Column} />
      }
      onClick={handleDropdownClick}
      onClose={handleClose}
    >
      <Menu className="neeto-editor-table__item">
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
          placeholder={t("neetoEditor.placeholders.rows")}
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
            size="small"
            onClick={handleSubmit}
          />
        </div>
      </Menu>
    </Dropdown>
  );
};

export default memo(TableOption);
