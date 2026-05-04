import React, { useState } from "react";

import { Editor, EditorContent } from "src/v2";

import { INITIAL_CONTENT, ADDONS, MENTIONS } from "../../../Walkthroughs/Output/constants";

const EditorContentDemo = () => {
  const [content, setContent] = useState(INITIAL_CONTENT);

  return (
    <div className="neeto-ui-flex neeto-ui-flex-col neeto-ui-gap-4">
      <div
        className="neeto-ui-border-gray-400 neeto-ui-rounded neeto-ui-border"
        style={{
          border: "1px solid rgb(var(--neeto-ui-gray-400))",
          padding: "25px",
        }}
      >
        <EditorContent
          {...{ content }}
          className="neeto-ui-p-4"
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
