import { NodeViewWrapper } from "@tiptap/react";
import classNames from "classnames";
import { mergeRight } from "ramda";
import { Resizable } from "re-resizable";

import Menu from "../Image/Menu";

const EmbedComponent = ({
  node,
  editor,
  getPos,
  updateAttributes,
  deleteNode,
}) => {
  const { figheight, figwidth, align, border } = node.attrs;
  const { view } = editor;
  let height = figheight;
  let width = figwidth;

  const handleResize = (_event, _direction, ref) => {
    height = ref.offsetHeight;
    width = ref.offsetWidth;
    view.dispatch(
      view.state.tr.setNodeMarkup(
        getPos(),
        undefined,
        mergeRight(node.attrs, {
          figheight: height,
          figwidth: width,
          height,
          width,
        })
      )
    );
    editor.commands.focus();
  };

  return (
    <NodeViewWrapper
      data-cy="neeto-editor-video-wrapper"
      className={classNames(
        "neeto-editor__video-wrapper",
        `neeto-editor__video--${align}`,
        { "neeto-editor__video--bordered": border }
      )}
    >
      <Resizable
        lockAspectRatio
        className="neeto-editor__video-iframe"
        size={{ height, width }}
        onResizeStop={handleResize}
      >
        <Menu {...{ align, border, deleteNode, editor, updateAttributes }} />
        <iframe {...node.attrs} allowFullScreen data-border={border} />
      </Resizable>
    </NodeViewWrapper>
  );
};

export default EmbedComponent;
