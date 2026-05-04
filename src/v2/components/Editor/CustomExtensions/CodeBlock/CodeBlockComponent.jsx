import React, { useRef, useState, useCallback, useEffect } from "react";

import { Button, DropdownMenu, Input } from "@bigbinary/neeto-atoms";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { ChevronDown, Highlighter } from "lucide-react";
// CopyToClipboardButton from molecules v1 — molecules /v2 not available in
// installed version; revisit during molecules upgrade.
import CopyToClipboardButton from "neetomolecules/CopyToClipboardButton";
import { difference, intersection, union } from "ramda";
import { useTranslation } from "react-i18next";

import {
  LINE_NUMBER_OPTIONS,
  SORTED_LANGUAGE_LIST,
} from "components/Editor/CustomExtensions/CodeBlock/constants";
import { codeBlockHighlightKey } from "components/Editor/CustomExtensions/CodeBlock/plugins";

const { Menu, MenuItem } = DropdownMenu;

const CodeBlockComponent = ({ node, editor, updateAttributes }) => {
  const [keyword, setKeyword] = useState("");
  const [showHighlightButton, setShowHighlightButton] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(
    node.attrs.linenumbers
  );
  const ref = useRef();

  const { t } = useTranslation();

  const filteredAndSortedLanguageList = SORTED_LANGUAGE_LIST.filter(language =>
    language.includes(keyword)
  );

  const handleLanguageSelect = language => {
    updateAttributes({ language });
    setKeyword("");
    editor?.commands?.focus();
  };

  const handleContentMount = node => {
    if (ref.current && node?.offsetHeight) {
      ref.current.style.minHeight = `${node.offsetHeight}px`;
    }
  };

  const handleSelectionChange = useCallback(() => {
    const { from, to } = editor.state.selection;
    const isCodeBlockSelected = editor.isActive("codeBlock");
    setShowHighlightButton(isCodeBlockSelected && from !== to);
  }, [editor]);

  useEffect(() => {
    editor.on("selectionUpdate", handleSelectionChange);

    return () => {
      editor.off("selectionUpdate", handleSelectionChange);
    };
  }, [editor, handleSelectionChange]);

  useEffect(() => {
    editor.view.dispatch(editor.state.tr.setMeta(codeBlockHighlightKey, true));
  }, []);

  const handleHighlight = () => {
    const { from, to } = editor.state.selection;
    const $from = editor.state.doc.resolve(from);

    const codeBlock = $from.node($from.depth);
    const codeBlockStart = $from.start($from.depth);

    const textBeforeSelection = codeBlock.textBetween(0, from - codeBlockStart);
    const startLine = textBeforeSelection.split("\n").length;
    const selectedText = codeBlock.textBetween(
      from - codeBlockStart,
      to - codeBlockStart
    );
    const selectedLines = selectedText.split("\n");

    const newSelectedLines = selectedLines.map((_, index) => startLine + index);
    const currentHighlightedLines = codeBlock.attrs.highlightedLines || [];

    const overlapLines = intersection(
      currentHighlightedLines,
      newSelectedLines
    );

    let highlightedLines;

    if (overlapLines.length === newSelectedLines.length) {
      highlightedLines = difference(currentHighlightedLines, newSelectedLines);
    } else {
      highlightedLines = union(currentHighlightedLines, newSelectedLines);
    }

    editor.commands.updateAttributes(codeBlock.type, { highlightedLines });
    editor.view.dispatch(editor.state.tr.setMeta(codeBlockHighlightKey, true));
  };

  return (
    <NodeViewWrapper
      className="ne-codeblock-nodeview-wrapper"
      data-testid="neeto-editor-code-block"
    >
      <div {...{ ref }}>
        <pre ref={handleContentMount}>
          <div
            className="neeto-editor-codeblock-options"
            contentEditable={false}
          >
            <DropdownMenu
              icon={ChevronDown}
              buttonProps={{ size: "sm", variant: "secondary" }}
              label={
                showLineNumbers === "true"
                  ? LINE_NUMBER_OPTIONS[0].label
                  : LINE_NUMBER_OPTIONS[1].label
              }
            >
              <Menu className="neeto-editor-codeblock-options__menu">
                {LINE_NUMBER_OPTIONS.map(({ label, value }) => (
                  <MenuItem
                    key={label}
                    onClick={() => {
                      setShowLineNumbers(value);
                      updateAttributes({ linenumbers: value });
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </DropdownMenu>
            <DropdownMenu
              icon={ChevronDown}
              label={node.attrs?.language || t("neetoEditor.common.auto")}
              buttonProps={{ size: "sm", variant: "secondary" }}
            >
              <Input
                autoFocus
                className="neeto-editor-codeblock-options__input"
                placeholder={t("neetoEditor.placeholders.searchLanguages")}
                size="small"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
              <Menu className="neeto-editor-codeblock-options__menu">
                {filteredAndSortedLanguageList.map(language => (
                  <MenuItem
                    key={language}
                    onClick={() => handleLanguageSelect(language)}
                  >
                    {language || t("neetoEditor.common.auto")}
                  </MenuItem>
                ))}
              </Menu>
            </DropdownMenu>
            <CopyToClipboardButton
              size="small"
              style="tertiary"
              value={node?.content?.content[0]?.text}
            />
            {showHighlightButton && (
              <Button
                icon={Highlighter}
                size="sm"
                variant="secondary"
                tooltipProps={{ content: t("neetoEditor.menu.highlight") }}
                onClick={handleHighlight}
              />
            )}
          </div>
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
