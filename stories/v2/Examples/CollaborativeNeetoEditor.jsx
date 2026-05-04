import React, { useCallback, useState, useEffect } from "react";

import { TiptapCollabProvider } from "@hocuspocus/provider";
import { findBy } from "neetocist";
import * as Y from "yjs";

import { Editor } from "src/v2";

const CollaborativeNeetoEditor = () => {
  const doc = new Y.Doc();
  const [editor, setEditor] = useState(null);
  const editorRef = useCallback(node => {
    if (node) setEditor(node.editor);
  }, []);

  const provider = new TiptapCollabProvider({
    name: "neeto-editor_document.v2.new",
    appId: "7j9y6m10",
    token: "notoken",
    document: doc,
  });
  const sampleNames = ["Sam", "Alex", "Liam", "Olivia", "Emma", "Oliver"];

  const sampleColors = [
    "#F56565",
    "#ED64A6",
    "#68D391",
    "#63B3ED",
    "#F6E05E",
    "#FC8181",
  ];

  const getRandom = list => {
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  };

  useEffect(() => {
    if (!editor) return;
    const collaborationCursorExtension = findBy(
      { name: "collaborationCursor" },
      editor.extensionManager.extensions
    );

    if (collaborationCursorExtension) {
      const newUser = {
        name: getRandom(sampleNames),
        color: getRandom(sampleColors),
      };
      editor.commands.updateUser(newUser);
    }
  }, [editor]);

  return (
    <div className="space-y-4">
      <Editor
        autoFocus
        collaborationProvider={provider}
        contentClassName="border"
        ref={editorRef}
      />
    </div>
  );
};

export default CollaborativeNeetoEditor;
