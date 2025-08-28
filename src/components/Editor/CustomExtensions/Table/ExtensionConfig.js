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
    const colgroups = [];

    const tableBody = node?.content?.firstChild;
    if (tableBody && tableBody.firstChild) {
      const firstRow = tableBody.firstChild;
      if (firstRow && firstRow.childCount) {
        for (let i = 0; i < firstRow.childCount; i++) {
          const cell = firstRow.child(i);
          let style = "min-width: 100px;";
          if (cell.attrs?.colwidth) {
            style += `width: ${cell.attrs.colwidth}px;`;
          }
          colgroups.push(["col", { style }]);
        }
      }
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
      ["table", {}, ["colgroup", ...colgroups], ["tbody", 0]],
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
