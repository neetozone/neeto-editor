import { Form, Input, ActionBlock } from "neetoui/formik";
import { useTranslation } from "react-i18next";

import { VIDEO_EMBED_FORM_VALIDATION_SCHEMA } from "./constants";

import { validateUrl } from "../CustomExtensions/Embeds/utils";

const VideoEmbedForm = ({ onEmbedVideo, onAttachVideo, onClose }) => {
  const { t } = useTranslation();

  const initialValues = { url: "" };

  const onSubmit = ({ url }) => {
    if (validateUrl(url)) onEmbedVideo(url);
    else onAttachVideo(url);
    onClose();
  };

  return (
    <div className="ne-video-embed-form">
      <Form
        formikProps={{
          initialValues,
          validationSchema: VIDEO_EMBED_FORM_VALIDATION_SCHEMA,
          onSubmit,
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
                name="url"
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
                  onClose();
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
  );
};

export default VideoEmbedForm;
