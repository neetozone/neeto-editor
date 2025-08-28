import { noop } from "neetocist";

function updateColumns(node, colgroup, table, cellMinWidth) {
  let totalWidth = 0;
  let fixedWidth = true;
  let nextDOM = colgroup.firstChild;
  const row = node.firstChild;

  for (let i = 0, col = 0; i < row.childCount; i += 1) {
    const { colspan, colwidth } = row.child(i).attrs;

    for (let j = 0; j < colspan; j += 1, col += 1) {
      const hasWidth = colwidth && colwidth[j];
      const cssWidth = hasWidth ? `${hasWidth}px` : "";

      totalWidth += hasWidth || cellMinWidth;

      if (!hasWidth) {
        fixedWidth = false;
      }

      if (!nextDOM) {
        colgroup.appendChild(document.createElement("col")).style.width =
          cssWidth;
      } else {
        if (nextDOM.style.width !== cssWidth) {
          nextDOM.style.width = cssWidth;
        }

        nextDOM = nextDOM.nextSibling;
      }
    }
  }

  while (nextDOM) {
    const after = nextDOM.nextSibling;

    nextDOM.parentNode.removeChild(nextDOM);
    nextDOM = after;
  }

  if (fixedWidth) {
    table.style.width = `${totalWidth}px`;
    table.style.minWidth = "";
  } else {
    table.style.width = "";
    table.style.minWidth = `${totalWidth}px`;
  }
}

export class TableView {
  constructor(node, cellMinWidth) {
    this.node = node;
    this.cellMinWidth = cellMinWidth;
    this.dom = document.createElement("div");

    const alignmentSuffix = node.attrs?.textAlign || "left";
    const alignmentClass = `neeto-editor-table--${alignmentSuffix}`;
    this.dom.className = `neeto-editor-table ${alignmentClass}`;
    this.wrapper = document.createElement("div");
    this.wrapper.className = "neeto-editor-table__wrapper";
    this.table = this.dom
      .appendChild(this.wrapper)
      .appendChild(document.createElement("table"));
    this.colgroup = this.table.appendChild(document.createElement("colgroup"));
    this.wrapper.appendChild(
      this.buildController({
        className: "neeto-editor-table__add-column",
        handleClick: this.insertColumn,
      })
    );

    this.dom.appendChild(
      this.buildController({
        className: "neeto-editor-table__add-row",
        handleClick: () => this.table.insertRow(),
      })
    );
    updateColumns(node, this.colgroup, this.table, cellMinWidth);
    this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }

  update(node) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    updateColumns(node, this.colgroup, this.table, this.cellMinWidth);

    const alignmentSuffix = node.attrs?.textAlign || "left";
    const currentAlignmentClass = `neeto-editor-table--${alignmentSuffix}`;

    this.dom.classList.remove(
      "neeto-editor-table--left",
      "neeto-editor-table--center",
      "neeto-editor-table--right"
    );

    this.dom.classList.add(currentAlignmentClass);

    return true;
  }

  ignoreMutation(mutation) {
    return (
      mutation.type === "attributes" &&
      (mutation.target === this.table ||
        this.colgroup.contains(mutation.target))
    );
  }

  buildController = ({ className = "", handleClick = noop }) => {
    const controller = document.createElement("div");
    const icon = document.createElement("p");
    controller.className = className;
    controller.onclick = handleClick;
    icon.textContent = "+";
    controller.appendChild(icon);

    return controller;
  };

  insertColumn = () => {
    this.table.querySelectorAll("tr").forEach(tr => {
      if (tr.firstChild?.nodeName === "TH") {
        const th = document.createElement("th");
        th.appendChild(document.createElement("p"));
        tr.appendChild(th);
      } else {
        const td = document.createElement("td");
        td.appendChild(document.createElement("p"));
        tr.appendChild(td);
      }
    });
  };
}
