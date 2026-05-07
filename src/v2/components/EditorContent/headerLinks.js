// eslint-disable-next-line @bigbinary/neeto/file-name-and-export-name-standards
import { buildHeaderLinks } from "./utils/headers";

const applyDecorations = () => {
  const editorContent = document.querySelector(".neeto-editor-content");

  if (editorContent) buildHeaderLinks(editorContent);
};

(() => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyDecorations);
  } else applyDecorations();

  window.neetoEditor = window.neetoEditor ?? {};
  window.neetoEditor.applyHeaderDecorations = applyDecorations;
})();
