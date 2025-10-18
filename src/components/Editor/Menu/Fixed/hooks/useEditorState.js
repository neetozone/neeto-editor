import { useCallback, useEffect } from "react";

import { noop } from "neetocist";
import { last } from "ramda";

import { EDITOR_OPTIONS } from "src/common/constants";
import useEditorStore from "src/stores/useEditorStore";

import { EDITOR_MARKS } from "./constants";

import { FONT_SIZE_OPTIONS } from "../../constants";

const useEditorState = ({ editor, neetoKbArticleState }) => {
  const { setMarksState, marksState } = useEditorStore.pick();

  const handleSelectionUpdate = useCallback(
    ({ editor }) => {
      const activeMarks = {};

      EDITOR_MARKS.forEach(mark => {
        if (mark === EDITOR_OPTIONS.NEETO_KB_ARTICLE) {
          activeMarks[mark] = {
            isActive: neetoKbArticleState?.active || false,
          };
        } else {
          activeMarks[mark] = { isActive: editor.isActive(mark) };
        }
      });

      const activeFontSizeOption =
        FONT_SIZE_OPTIONS.find(({ value: level }) =>
          editor.isActive("heading", { level })
        ) || last(FONT_SIZE_OPTIONS);

      activeMarks["fontSizeOption"] = activeFontSizeOption;

      setMarksState(activeMarks);
    },
    [setMarksState, neetoKbArticleState?.active]
  );

  const updateHistoryOptionsState = useCallback(
    ({ editor }) => {
      const undoOptionState = { disabled: !editor.can().undo() };
      const redoOptionState = { disabled: !editor.can().redo() };

      const updatedMarksState = {
        ...marksState,
        [EDITOR_OPTIONS.UNDO]: undoOptionState,
        [EDITOR_OPTIONS.REDO]: redoOptionState,
      };
      setMarksState(updatedMarksState);
    },
    [marksState, setMarksState]
  );

  useEffect(() => {
    if (!editor) return noop;

    updateHistoryOptionsState({ editor });

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("update", handleSelectionUpdate);
    editor.on("transaction", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("update", handleSelectionUpdate);
      editor.off("transaction", handleSelectionUpdate);
    };
  }, [editor, handleSelectionUpdate]);

  // Update editor state when neetoKbArticleState changes
  useEffect(() => {
    if (!editor) return;

    handleSelectionUpdate({ editor });
  }, [editor, neetoKbArticleState?.active, handleSelectionUpdate]);
};

export default useEditorState;
