/* eslint-disable @bigbinary/neeto/file-name-and-export-name-standards */
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const codeBlockHighlightKey = new PluginKey("codeBlockHighlight");

function createLineDecoration(from, lineNumber) {
  return Decoration.widget(from, view => {
    const line = document.createElement("div");
    line.className = "highlighted-line";
    line.setAttribute("data-line-number", lineNumber.toString());

    // Set the height of the highlight to match the line height
    const lineElement = view.domAtPos(from).node;
    if (lineElement instanceof Element) {
      const lineHeight = window.getComputedStyle(lineElement).lineHeight;
      line.style.height = lineHeight;
    }

    return line;
  });
}

function getLineRanges(node, pos) {
  const lines = node.textContent.split("\n");
  let currentPos = pos + 1; // +1 to skip the opening tag of the code block

  return lines.map((line, index) => {
    const from = currentPos;
    const to = from + line.length; // +1 for newline, except last line
    currentPos = to + (index < lines.length - 1 ? 1 : 0);

    return { from, to, lineNumber: index + 1 };
  });
}

const codeBlockHighlightPlugin = new Plugin({
  key: codeBlockHighlightKey,
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      set = set.map(tr.mapping, tr.doc);

      if (tr.getMeta(codeBlockHighlightKey)) {
        const decorations = [];
        tr.doc.descendants((node, pos) => {
          if (node.type.name !== "codeBlock") return;

          const highlightedLines = node.attrs.highlightedLines || [];
          const lineRanges = getLineRanges(node, pos);

          lineRanges.forEach(({ from, lineNumber }) => {
            if (highlightedLines.includes(lineNumber)) {
              decorations.push(createLineDecoration(from, lineNumber));
            }
          });
        });

        return DecorationSet.create(tr.doc, decorations);
      }

      return set;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});

export { codeBlockHighlightPlugin, codeBlockHighlightKey };
