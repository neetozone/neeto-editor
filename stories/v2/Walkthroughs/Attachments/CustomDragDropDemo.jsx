import React, { useState, useRef } from "react";

import { Button, Sheet, Typography } from "@bigbinary/neeto-atoms";

import { Attachments } from "../../../../src/v2";

const CustomDragDropDemo = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const dragDropRef = useRef(null);

  return (
    <>
      <Button onClick={() => setShowSheet(true)}>Show Sheet</Button>
      <Sheet isOpen={showSheet} onClose={() => setShowSheet(false)}>
        <Sheet.Header>
          <Typography style="h2" weight="semibold">
            Typography
          </Typography>
        </Sheet.Header>
        <Sheet.Body>
          <div
            className="flex justify-center w-full ne-attachments__wrapper h-96"
            ref={dragDropRef}
          >
            <Attachments
              attachments={attachments}
              dragDropRef={dragDropRef}
              onChange={setAttachments}
            />
          </div>
        </Sheet.Body>
      </Sheet>
    </>
  );
};

export default CustomDragDropDemo;
