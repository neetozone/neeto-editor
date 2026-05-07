import classnames from "classnames";
// TODO: switch to neetomolecules/v2/DynamicVariables once molecules ships v2 of
// this component (not present as of @bigbinary/neeto-molecules@4.1.74).
import DynamicVariables from "neetomolecules/DynamicVariables";
import { isEmpty } from "ramda";
import { useTranslation } from "react-i18next";

const MenuDynamicVariables = ({
  editor,
  variables = [],
  standalone = false,
}) => {
  const { t } = useTranslation();

  if (isEmpty(variables)) return null;

  const handleVariableClick = item => {
    const { category, categoryLabel, key, label } = item;
    const variableName = category ? `${category}.${key}` : key;
    const variableLabel = category
      ? `${categoryLabel || category}:${label}`
      : label;

    editor
      .chain()
      .focus()
      .setVariable({ id: variableName, label: variableLabel })
      .run();
  };

  return (
    <div
      data-testid="neeto-editor-fixed-menu-variables"
      className={classnames("neeto-editor-fixed-menu__variables", {
        "neeto-editor-fixed-menu__variables--standalone": standalone,
      })}
    >
      <DynamicVariables
        {...{ variables }}
        buttonSize="small"
        dropdownProps={{ classNames: "ne-editor-variables-popup" }}
        buttonProps={{
          tooltipProps: {
            content: t("neetoEditor.menu.dynamicVariables"),
            position: "bottom",
          },
        }}
        onVariableClick={handleVariableClick}
      />
    </div>
  );
};

export default MenuDynamicVariables;
