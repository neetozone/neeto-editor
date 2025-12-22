import React, { useRef, useState, useCallback, useEffect } from "react";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Down, Highlight } from "neetoicons";
import CopyToClipboardButton from "neetomolecules/CopyToClipboardButton";
import { Dropdown, Input, Button } from "neetoui";
import { difference, intersection, union } from "ramda";
import { useTranslation } from "react-i18next";

import { LINE_NUMBER_OPTIONS, SORTED_LANGUAGE_LIST } from "./constants";
import { codeBlockHighlightKey } from "./plugins";

const { Menu, MenuItem } = Dropdown;

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

    // Check the overlap between new selection and current highlights
    const overlapLines = intersection(
      currentHighlightedLines,
      newSelectedLines
    );

    let highlightedLines;

    if (overlapLines.length === newSelectedLines.length) {
      // If the new selection is entirely within currently highlighted lines,
      // remove the highlight from the selected lines
      highlightedLines = difference(currentHighlightedLines, newSelectedLines);
    } else {
      // Add unhighlighted lines in the new selection to the highlight list
      highlightedLines = union(currentHighlightedLines, newSelectedLines);
    }

    editor.commands.updateAttributes(codeBlock.type, { highlightedLines });
    // Trigger the plugin to update decorations
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
            <Dropdown
              appendTo={() => document.body}
              buttonSize="small"
              buttonStyle="tertiary"
              icon={Down}
              strategy="fixed"
              zIndex={99999}
              label={
                showLineNumbers === "true"
                  ? LINE_NUMBER_OPTIONS[0].label
                  : LINE_NUMBER_OPTIONS[1].label
              }
            >
              <Menu className="neeto-editor-codeblock-options__menu">
                {LINE_NUMBER_OPTIONS.map(({ label, value }) => (
                  <MenuItem.Button
                    key={label}
                    onClick={() => {
                      setShowLineNumbers(value);
                      updateAttributes({ linenumbers: value });
                    }}
                  >
                    {label}
                  </MenuItem.Button>
                ))}
              </Menu>
            </Dropdown>
            <Dropdown
              appendTo={() => document.body}
              buttonSize="small"
              buttonStyle="tertiary"
              icon={Down}
              label={node.attrs?.language || t("neetoEditor.common.auto")}
              strategy="fixed"
              zIndex={99999}
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
                  <MenuItem.Button
                    key={language}
                    onClick={() => handleLanguageSelect(language)}
                  >
                    {language || t("neetoEditor.common.auto")}
                  </MenuItem.Button>
                ))}
              </Menu>
            </Dropdown>
            <CopyToClipboardButton
              size="small"
              style="tertiary"
              value={node?.content?.content[0]?.text}
            />
            {showHighlightButton && (
              <Button
                icon={Highlight}
                size="small"
                style="tertiary"
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
