import { Button } from "neetoui";
import { Form, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";

import { VIDEO_EMBED_FORM_VALIDATION_SCHEMA } from "./constants";

import { validateUrl } from "../CustomExtensions/Embeds/utils";

const VideoEmbedForm = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();

  const handleSubmit = ({ videoUrl }) => {
    const validatedUrl = validateUrl(videoUrl);
    if (validatedUrl) {
      onSubmit(videoUrl);
    }
  };

  return (
    <div className="ne-video-embed-form">
      <Form
        formikProps={{
          initialValues: { videoUrl: "" },
          onSubmit: handleSubmit,
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
            <div className="ne-video-embed-form__footer ne-video-embed-form__footer--flex">
              <Button
                data-cy="neeto-editor-video-embed-submit"
                disabled={!dirty}
                label={t("neetoEditor.common.saveChanges")}
                loading={isSubmitting}
                size="small"
                type="submit"
              />
              <Button
                data-cy="neeto-editor-video-embed-cancel"
                label={t("neetoEditor.common.cancel")}
                size="small"
                style="text"
                onClick={() => {
                  resetForm();
                  onCancel?.();
                }}
              />
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default VideoEmbedForm;
