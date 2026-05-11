import React, { useState, useRef } from "react";

import { Button, Sheet } from "@bigbinary/neeto-atoms";

import { Attachments } from "../../../../src/v2";

const CustomDragDropDemo = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const dragDropRef = useRef(null);

  return (
    <>
      <Button
        label="Show Sheet"
        onClick={() => setShowSheet(true)}
      />
      <Sheet isOpen={showSheet} onClose={() => setShowSheet(false)}>
        <Sheet.Header>
          <Sheet.Title>Custom drop zone</Sheet.Title>
        </Sheet.Header>
        <Sheet.Body>
          <div
            className="flex w-full h-96 ne-attachments__wrapper"
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
