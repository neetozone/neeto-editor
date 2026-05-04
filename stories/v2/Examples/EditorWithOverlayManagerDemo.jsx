import React, { useRef, useState } from "react";

import { Button, Sheet, Typography } from "@bigbinary/neeto-atoms";

import { Editor } from "../../../src/v2";

const EditorWithOverlayManager = () => {
  const [showSheet, setShowSheet] = useState(false);
  const initialFocusRef = useRef(null);

  return (
    <>
      <Button onClick={() => setShowSheet(true)}>Show Sheet</Button>
      <Sheet
        initialFocusRef={initialFocusRef}
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
      >
        <Sheet.Header>
          <Typography style="h2" weight="semibold">
            Typography
          </Typography>
        </Sheet.Header>
        <Sheet.Body>
          <Editor ref={initialFocusRef} />
        </Sheet.Body>
      </Sheet>
    </>
  );
};

export default EditorWithOverlayManager;
