import { withT } from "neetocommons/react-utils";
import { Form, Input, ActionBlock } from "neetoui/formik";

import { VIDEO_EMBED_FORM_VALIDATION_SCHEMA } from "./constants";

const VideoEmbedForm = withT(({ t, onSubmit, onCancel }) => (
  <div className="ne-video-embed-form">
    <Form
      formikProps={{
        initialValues: { videoUrl: "" },
        onSubmit: ({ videoUrl }) => onSubmit(videoUrl),
        validationSchema: VIDEO_EMBED_FORM_VALIDATION_SCHEMA,
      }}
    >
      {({ dirty, isSubmitting, resetForm }) => (
        <>
          <div className="ne-video-embed-form__content">
            <Input
              autoFocus
              unlimitedChars
              data-cy="neeto-editor-video-embed-input"
              label={t("neetoEditor.common.videoUrl")}
              name="videoUrl"
              placeholder={t("neetoEditor.placeholders.embedUrl")}
              size="medium"
              type="text"
            />
          </div>
          <ActionBlock
            cancelButtonProps={{
              "data-cy": "neeto-editor-video-embed-cancel",
              label: t("neetoEditor.common.cancel"),
              size: "small",
              onClick: () => {
                resetForm();
                onCancel?.();
              },
            }}
            submitButtonProps={{
              "data-cy": "neeto-editor-video-embed-submit",
              disabled: !dirty,
              label: t("neetoEditor.common.saveChanges"),
              loading: isSubmitting,
              size: "small",
            }}
          />
        </>
      )}
    </Form>
  </div>
));

export default VideoEmbedForm;
