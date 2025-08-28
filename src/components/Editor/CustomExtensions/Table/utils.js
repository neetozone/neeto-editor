import { CellSelection } from "@tiptap/pm/tables";
import { t } from "i18next";
import { isNotPresent } from "neetocist";
import {
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  InsertRow,
  InsertColumn,
  MergeSplit,
  ToggleHeaderRow,
} from "neetoicons";

const shouldShowMergeCellToggler = selection => {
  if (isNotPresent(selection)) return false;

  if (selection instanceof CellSelection) return true;

  let depth = selection.$from.depth;

  while (depth > 0) {
    const node = selection.$from.node(depth);
    const nodeRoleInTable = node?.type?.spec?.tableRole;
    if (nodeRoleInTable === "cell" || nodeRoleInTable === "header_cell") {
      const { colspan, rowspan } = node.attrs;

      return colspan > 1 || rowspan > 1;
    }
    depth -= 1;
  }

  return false;
};

const setTableAlignment = (editor, alignment) => {
  const { state, view } = editor;
  const { selection } = state;

  let tableNode = null;
  let tablePos = null;

  state.doc.descendants((node, pos) => {
    if (
      node.type.name === "table" &&
      pos <= selection.from &&
      selection.from <= pos + node.nodeSize
    ) {
      tableNode = node;
      tablePos = pos;

      return false;
    }

    return true;
  });

  if (tableNode && tablePos !== null) {
    const tr = state.tr;
    const currentAttrs =
      tableNode && tableNode["attrs"] ? tableNode["attrs"] : {};
    const newAttrs = { ...currentAttrs, textAlign: alignment };

    tr.setNodeMarkup(tablePos, null, newAttrs);
    view.dispatch(tr);
  }
};

export const tableActions = ({ editor }) => [
  {
    type: "dropdown",
    label: t("neetoEditor.table.textAlign"),
    items: [
      {
        type: "left",
        command: () => setTableAlignment(editor, "left"),
        tooltipLabel: t("neetoEditor.table.leftAlign"),
      },
      {
        type: "center",
        command: () => setTableAlignment(editor, "center"),
        tooltipLabel: t("neetoEditor.table.centerAlign"),
      },
      {
        type: "right",
        command: () => setTableAlignment(editor, "right"),
        tooltipLabel: t("neetoEditor.table.rightAlign"),
      },
    ],
  },
  {
    label: t("neetoEditor.table.insertRow"),
    command: () => editor.commands.addRowAfter(),
    icon: InsertRow,
  },
  {
    label: t("neetoEditor.table.insertColumn"),
    command: () => editor.commands.addColumnAfter(),
    icon: InsertColumn,
  },
  {
    label: t("neetoEditor.table.deleteRow"),
    command: () => editor.chain().focus().deleteRow().run(),
    icon: DeleteRow,
    isVisible: true,
  },
  {
    label: t("neetoEditor.table.deleteColumn"),
    command: () => editor.chain().focus().deleteColumn().run(),
    icon: DeleteColumn,
  },
  {
    label: t("neetoEditor.table.mergeSplit"),
    command: () => editor.chain().focus().mergeOrSplit().run(),
    icon: MergeSplit,
    isHidden: !shouldShowMergeCellToggler(editor.state?.selection),
  },
  {
    label: t("neetoEditor.table.toggleHeaderRow"),
    command: () => editor.chain().focus().toggleHeaderRow().run(),
    icon: ToggleHeaderRow,
  },
  {
    label: t("neetoEditor.table.delete"),
    command: () => editor.commands.deleteTable(),
    icon: DeleteTable,
  },
];
