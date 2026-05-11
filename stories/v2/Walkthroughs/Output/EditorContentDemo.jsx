import React, { useState } from "react";

import { Editor, EditorContent } from "src/v2";

import { INITIAL_CONTENT, ADDONS, MENTIONS } from "../../../Walkthroughs/Output/constants";

const EditorContentDemo = () => {
  const [content, setContent] = useState(INITIAL_CONTENT);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded border"
        style={{
          border: "1px solid rgb(var(--neeto-ui-gray-400))",
          padding: "25px",
        }}
      >
        <EditorContent
          {...{ content }}
          className="p-4"
          configuration={{ enableHeaderLinks: true }}
        />
      </div>
      <div>
        <h3>Editor</h3>
        <Editor
          addons={ADDONS}
          initialValue={content}
          mentions={MENTIONS}
          onChange={setContent}
        />
      </div>
    </div>
  );
};

export default EditorContentDemo;
