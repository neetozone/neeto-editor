/* eslint-disable @bigbinary/neeto/file-name-and-export-name-standards */
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
