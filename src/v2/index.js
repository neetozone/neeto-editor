/* eslint-disable @bigbinary/neeto/file-name-and-export-name-standards */
/**
 * neeto-editor v2 entry — neeto-atoms based.
 *
 * Consumers import from `@bigbinary/neeto-editor/v2` to get the shadcn-themed
 * editor. v1 (`@bigbinary/neeto-editor`) remains the neetoUI-based editor and
 * stays unchanged until all consumers migrate.
 *
 * Every export below mounts v2 internals end-to-end. Editor → v2 Menu → v2
 * Fixed/Bubble/Headless → v2 leaves. Styles auto-inject at import time via
 * the side-effect SCSS import below — no separate `@bigbinary/neeto-editor/
 * v2/styles` import is needed by consumers. Same pattern as v1.
 */
import "src/v2/styles/index.scss";

import { EDITOR_OPTIONS } from "common/constants";

import { DEFAULT_EDITOR_OPTIONS } from "src/v2/components/Editor/constants";
import {
  isEditorOverlaysActive,
  isEmojiSuggestionsMenuActive,
  transformEditorContent,
} from "src/v2/components/Editor/utils";
import { substituteVariables } from "src/v2/components/EditorContent/utils";
import {
  isEditorContentWithinLimit,
  isEditorEmpty,
  removeEmptyTags,
} from "utils/common";

import Attachments from "./components/Attachments";
import Editor from "./components/Editor";
import FormikEditor from "./components/Editor/FormikEditor";
import Menu from "./components/Editor/Menu";
import EditorContent from "./components/EditorContent";

export {
  Editor,
  EditorContent,
  Menu,
  removeEmptyTags,
  isEditorEmpty,
  isEditorContentWithinLimit,
  substituteVariables,
  FormikEditor,
  Attachments,
  isEditorOverlaysActive,
  isEmojiSuggestionsMenuActive,
  transformEditorContent,
  EDITOR_OPTIONS,
  DEFAULT_EDITOR_OPTIONS,
};
