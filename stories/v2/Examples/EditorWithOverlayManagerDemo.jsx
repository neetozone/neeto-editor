import React, { useRef, useState } from "react";

import { Button, Sheet } from "@bigbinary/neeto-atoms";

import { Editor } from "../../../src/v2";

const EditorWithOverlayManager = () => {
  const [showSheet, setShowSheet] = useState(false);
  const initialFocusRef = useRef(null);

  return (
    <>
      <Button label="Show Sheet" onClick={() => setShowSheet(true)} />
      <Sheet
        initialFocusRef={initialFocusRef}
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
      >
        <Sheet.Header>
          <Sheet.Title>Editor</Sheet.Title>
        </Sheet.Header>
        <Sheet.Body>
          <Editor ref={initialFocusRef} />
        </Sheet.Body>
      </Sheet>
    </>
  );
};

export default EditorWithOverlayManager;
