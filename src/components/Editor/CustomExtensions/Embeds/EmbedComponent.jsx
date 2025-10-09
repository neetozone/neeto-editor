import { NodeViewWrapper } from "@tiptap/react";
import classnames from "classnames";
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
  const { figheight, figwidth, align, aspectRatio } = node.attrs;
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
      className={`neeto-editor__video-wrapper neeto-editor__video--${align}`}
      data-cy="neeto-editor-video-wrapper"
    >
      <Resizable
        lockAspectRatio
        size={{ height, width }}
        className={classnames("neeto-editor__video-iframe", {
          "neeto-editor-aspect-square": aspectRatio === "1/1",
          "neeto-editor-aspect-video": aspectRatio === "16/9",
          "neeto-editor-aspect-4-3": aspectRatio === "4/3",
          "neeto-editor-aspect-3-2": aspectRatio === "3/2",
        })}
        onResizeStop={handleResize}
      >
        <Menu {...{ align, deleteNode, editor, updateAttributes }} />
        <iframe {...node.attrs} allowFullScreen />
      </Resizable>
    </NodeViewWrapper>
  );
};

export default EmbedComponent;
