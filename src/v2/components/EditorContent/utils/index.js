import { createElement } from "react";

import hljs from "highlight.js/lib/common";
import { lowlight } from "lowlight";
import { findBy } from "neetocist";
import { isEmpty } from "ramda";
import { renderToString } from "react-dom/server";

import {
  CODE_BLOCK_REGEX,
  LANGUAGE_LIST,
  VARIABLE_SPAN_REGEX,
} from "../constants";

const transformCode = code =>
  code.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");

const buildReactElementFromAST = element => {
  if (element.tagName) {
    const children = element.children
      ? element.children.map(buildReactElementFromAST)
      : null;

    return createElement(element.tagName, element.properties, children);
  }

  return element.value;
};

const splitCodeBlockIntoLines = codeBlock => {
  codeBlock.innerHTML = codeBlock.innerHTML.replace(
    /([ \S]*\n|[ \S]*$)/gm,
    match => `<div class="highlight-line">${match}</div>`
  );
};

const highlightLinesCode = (code, options) => {
  if (options === undefined) {
    return;
  }

  const paddingLeft = parseInt(window.getComputedStyle(code).paddingLeft);
  const paddingRight = parseInt(window.getComputedStyle(code).paddingRight);

  const lines = code.getElementsByClassName("highlight-line");
  const scroll_width = code.scrollWidth;
  // eslint-disable-next-line @bigbinary/neeto/use-array-methods
  for (const option of options) {
    for (let j = option.start; j <= option.end; ++j) {
      if (j >= lines.length) return;
      lines[j].style.backgroundColor = option.color;
      lines[j].style.minWidth = `${
        scroll_width - paddingLeft - paddingRight
      }px`;
    }
  }
};

export const highlightLinesElement = (code, options) => {
  // eslint-disable-next-line @bigbinary/neeto/use-array-methods
  for (const option of options) {
    --option.start;
    --option.end;
  }
  highlightLinesCode(code, options);
};

export const applySyntaxHighlightingAndLineNumbers = content => {
  lowlight.highlightAuto("");
  let highlightedAST = {};

  return content.replace(CODE_BLOCK_REGEX, (_, language, code) => {
    const highlightRegex = /data-highlighted-lines="([^"]*)"/;
    const linenumbersRegex = /data-linenumbers/;
    const highlightMatch = content.match(highlightRegex);

    if (language && LANGUAGE_LIST.includes(language)) {
      highlightedAST = lowlight.highlight(language, transformCode(code));
    } else {
      highlightedAST = hljs.highlightAuto(transformCode(code))._emitter.root;
      if (isEmpty(highlightedAST.children)) {
        highlightedAST = lowlight.highlight("javascript", transformCode(code));
      }
    }

    const highlightedNode = highlightedAST.children.map(
      buildReactElementFromAST
    );

    const dataHighlight = `data-highlighted-lines=${highlightMatch?.[1] ?? ""}`;
    const dataLinenumbers = content.match(linenumbersRegex)
      ? `data-linenumbers="true"`
      : "";

    return `<pre ${dataLinenumbers} ${dataHighlight}><code>${renderToString(
      highlightedNode
    )}</code></pre>`;
  });
};

export const applyLineHighlighting = editorContent => {
  const codeTags = editorContent?.querySelectorAll("pre code");

  codeTags.forEach(codeTag => {
    splitCodeBlockIntoLines(codeTag);

    const highlightedLines = codeTag
      .closest("pre")
      .getAttribute("data-highlighted-lines");

    if (highlightedLines) {
      const linesToHighlight = highlightedLines
        .split(",")
        .map(Number)
        .filter(Boolean);

      const highlightLinesOptions = linesToHighlight.map(line => ({
        start: line,
        end: line,
        color: "rgba(255, 255, 0, 0.2)",
      }));

      highlightLinesElement(codeTag, highlightLinesOptions);
    }
  });
};

export const substituteVariables = (highlightedContent, variables) =>
  highlightedContent.replace(VARIABLE_SPAN_REGEX, (matchedSpan, _, key) => {
    const keySplitted = key.split(".");
    if (keySplitted.length > 1) {
      const category = findBy({ category: keySplitted[0] }, variables);
      const variable = findBy(
        { key: keySplitted[1] },
        category?.variables || []
      );

      return variable?.value ? variable.value : matchedSpan;
    }

    const variable = findBy({ key: keySplitted[0] }, variables);

    return variable?.value ? variable.value : matchedSpan;
  });

export const convertPlainTextToHtml = htmlString => {
  if (/^<[a-z].*>/i.test(htmlString.trim())) return htmlString;

  return htmlString
    .split("\n")
    .reduce((html, str) => `${html}<p>${str}</p>`, "");
};
