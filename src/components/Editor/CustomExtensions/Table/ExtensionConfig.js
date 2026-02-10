import TiptapTable from "@tiptap/extension-table";

import { TableView } from "./TableView";

const Table = TiptapTable.extend({
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: true,
      handleWidth: 5,
      cellMinWidth: 100,
      View: TableView,
      lastColumnResizable: true,
      allowTableNodeSelection: true,
    };
  },

  parseHTML() {
    const getAlignmentFromElement = element => {
      if (!element) return null;

      const dataAlign = element.getAttribute("data-text-align");
      if (dataAlign) return dataAlign;

      if (element.classList.contains("neeto-editor-table--center")) {
        return "center";
      }

      if (element.classList.contains("neeto-editor-table--right")) {
        return "right";
      }

      if (element.classList.contains("neeto-editor-table--left")) {
        return "left";
      }

      return null;
    };

    return [
      {
        tag: "table",
        priority: 100,
        getAttrs: node => {
          const alignment = getAlignmentFromElement(node);
          if (alignment) {
            return { textAlign: alignment };
          }

          const parent = node.parentElement;
          if (parent && parent.classList.contains("table-responsive")) {
            const parentAlignment = getAlignmentFromElement(parent);
            if (parentAlignment) {
              return { textAlign: parentAlignment };
            }
          }

          return { textAlign: "left" };
        },
      },
    ];
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      textAlign: {
        default: "left",
        renderHTML: attributes => {
          if (!attributes.textAlign) return {};

          return {
            class: `neeto-editor-table--${attributes.textAlign}`,
            "data-text-align": attributes.textAlign,
          };
        },
      },
    };
  },

  renderHTML({ node }) {
    let totalWidth = 0;
    let fixedWidth = true;

    const colgroups = [];
    const cellMinWidth = this.options?.cellMinWidth ?? 100;
    const firstRow = node.content?.firstChild;

    if (firstRow && firstRow.childCount) {
      for (let i = 0; i < firstRow.childCount; i++) {
        const cell = firstRow.child(i);
        const { colspan, colwidth } = cell.attrs;
        const span = colspan || 1;

        for (let j = 0; j < span; j++) {
          const hasWidth = colwidth && colwidth[j];
          totalWidth += Number(hasWidth) || cellMinWidth;
          if (!hasWidth) fixedWidth = false;

          const style = hasWidth
            ? `min-width: ${cellMinWidth}px; width: ${Number(hasWidth)}px;`
            : `min-width: ${cellMinWidth}px;`;

          colgroups.push(["col", { style }]);
        }
      }
    }

    let tableStyle = "";
    if (totalWidth > 0) {
      tableStyle = fixedWidth
        ? `width: ${totalWidth}px;`
        : `min-width: ${totalWidth}px;`;
    }

    const alignmentClass = node.attrs?.textAlign
      ? `neeto-editor-table--${node.attrs.textAlign}`
      : "neeto-editor-table--left";

    return [
      "div",
      {
        class: `table-responsive ${alignmentClass}`,
        "data-text-align": node.attrs?.textAlign || "left",
      },
      [
        "table",
        tableStyle ? { style: tableStyle } : {},
        ["colgroup", ...colgroups],
        ["tbody", 0],
      ],
    ];
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      "Mod-alt-t": () =>
        this.editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .updateAttributes("table", { textAlign: "left" })
          .run(),
    };
  },
});

export default Table.configure({});
