import { useState } from "react";

import { withEventTargetValue } from "neetocommons/utils";
import { Check, Close } from "neetoicons";
import { Button, Label } from "neetoui";
import { useTranslation } from "react-i18next";

const TableOption = ({ editor, handleClose }) => {
  const { t } = useTranslation();

  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const handleSubmit = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols: columns, withHeaderRow: true })
      .run(),
      setRows(3);
    setColumns(3);
    handleClose();
  };

  return (
    <div className="neeto-editor-bubble-menu__table">
      <div className="neeto-editor-bubble-menu__table__menu-item">
        <Label className="neeto-editor-bubble-menu__table__input-label">
          {t("neetoEditor.menu.rows")}
        </Label>
        <input
          autoFocus
          data-testid="neeto-editor-fixed-menu-table-option-input"
          min="1"
          type="number"
          value={rows}
          onChange={withEventTargetValue(setRows)}
        />
      </div>
      <div className="neeto-editor-bubble-menu__table__menu-item">
        <Label className="neeto-editor-bubble-menu__table__input-label">
          {t("neetoEditor.menu.columns")}
        </Label>
        <input
          data-testid="neeto-editor-bubble-menu-table-option-input"
          min="1"
          type="number"
          value={columns}
          onChange={withEventTargetValue(setColumns)}
        />
      </div>
      <div className="neeto-editor-bubble-menu__table__buttons">
        <Button
          data-testid="neeto-editor-bubble-menu-table-option-create-button"
          icon={Check}
          size="small"
          style="secondary"
          onClick={handleSubmit}
        />
        <Button
          data-testid="neeto-editor-bubble-menu-table-option-create-button"
          icon={Close}
          size="small"
          style="secondary"
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default TableOption;
