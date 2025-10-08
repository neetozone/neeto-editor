import { useRef, useState } from "react";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import classNames from "classnames";
import { isNotPresent } from "neetocist";
import { Spinner } from "neetoui";
import { isEmpty, mergeRight } from "ramda";
import { Resizable } from "re-resizable";

import ImagePreviewModal from "./ImagePreviewModal";
import Menu from "./Menu";

const ImageComponent = ({
  node,
  editor,
  getPos,
  updateAttributes,
  deleteNode,
}) => {
  const { src, figheight, figwidth, align, alt, border } = node.attrs;

  const [captionWidth, setCaptionWidth] = useState(figwidth || 0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const figureRef = useRef(null);

  const { view } = editor;
  let height = figheight;
  let width = figwidth;
  const caption = node?.content?.content?.[0]?.text || "";

  const editorElement = figureRef.current?.closest(".neeto-editor");
  const maxImageWidth = editorElement?.offsetWidth - 50;

  const handleResizeStop = (_event, _direction, ref) => {
    height = ref.offsetHeight;
    width = ref.offsetWidth;

    if (width > maxImageWidth) {
      width = maxImageWidth;
      const aspectRatio = ref.offsetHeight / ref.offsetWidth;
      height = width * aspectRatio;
    }
    setCaptionWidth(width);
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

  if (isNotPresent(src) && isNotPresent(alt)) return null;

  return (
    <NodeViewWrapper
      data-cy="neeto-editor-image-wrapper"
      className={`neeto-editor__image-wrapper neeto-editor__image--${align} ${
        border ? "neeto-editor__image--bordered" : ""
      }`}
    >
      <figure ref={figureRef}>
        <Menu {...{ align, border, deleteNode, editor, updateAttributes }} />
        {src ? (
          <Resizable
            lockAspectRatio
            className="neeto-editor__image"
            minWidth="100px"
            size={{ height, width }}
            onResizeStop={handleResizeStop}
            onResize={(_event, _direction, ref) =>
              setCaptionWidth(ref.offsetWidth)
            }
          >
            <img
              {...{ ...node.attrs, src }}
              alt={caption}
              data-border={border}
              onClick={e => {
                e.stopPropagation();
                setPreviewUrl(src);
              }}
            />
          </Resizable>
        ) : (
          <div className="neeto-editor__image-placeholder">
            <Spinner />
          </div>
        )}
        <NodeViewContent
          as="figcaption"
          className={classNames({ "is-empty": isEmpty(caption) })}
          style={{ width: `${captionWidth}px` }}
        />
      </figure>
      <ImagePreviewModal {...{ previewUrl, setPreviewUrl }} />
    </NodeViewWrapper>
  );
};

export default ImageComponent;
