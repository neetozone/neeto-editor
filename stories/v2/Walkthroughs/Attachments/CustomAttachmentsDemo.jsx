import React, { useRef } from "react";

import { Button } from "@bigbinary/neeto-atoms";
import { noop } from "neetocist";

import { Attachments } from "src/v2";

const CustomAttachmentsDemo = () => {
  const attachmentsRef = useRef(null);

  const handleUpload = () =>
    attachmentsRef.current?.handleUploadAttachments() || noop;

  return (
    <>
      <Button onClick={handleUpload}>Custom upload button</Button>
      <Attachments
        className="pt-2"
        isIndependent={false}
        ref={attachmentsRef}
      />
    </>
  );
};

export default CustomAttachmentsDemo;
