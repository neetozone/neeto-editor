import { Tooltip } from "@bigbinary/neeto-atoms";
import { NodeViewWrapper } from "@tiptap/react";

import { MAX_VARIABLE_NAME_DISPLAY_LENGTH } from "src/v2/components/Editor/CustomExtensions/Variable/constants";

const VariableComponent = ({ node, extension }) => {
  const { id, label } = node.attrs;

  const variableName = label || id;
  const shouldTruncate = variableName.length > MAX_VARIABLE_NAME_DISPLAY_LENGTH;

  return (
    <NodeViewWrapper
      as="span"
      className="neeto-editor-variable"
      data-label={id}
      data-variable=""
    >
      {extension.options.charOpen}
      <Tooltip content={variableName} disabled={!shouldTruncate} position="top">
        {variableName?.substr(0, MAX_VARIABLE_NAME_DISPLAY_LENGTH)?.trim()}
        {shouldTruncate && "..."}
      </Tooltip>
      {extension.options.charClose}
    </NodeViewWrapper>
  );
};

export default VariableComponent;
