import { ActionBlock, Form, Input } from "@bigbinary/neeto-atoms/formik";
import { useTranslation } from "react-i18next";

import { validateUrl } from "src/v2/components/Editor/CustomExtensions/Embeds/utils";
import { VIDEO_EMBED_FORM_VALIDATION_SCHEMA } from "src/v2/components/Editor/MediaUploader/constants";

const VideoEmbedForm = ({ onEmbedVideo, onAttachVideo, onClose }) => {
  const { t } = useTranslation();

  const initialValues = { url: "" };

  const onSubmit = ({ url }) => {
    const embedUrl = validateUrl(url);
    if (embedUrl) onEmbedVideo(embedUrl);
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
                data-testid="neeto-editor-video-embed-input"
                label={t("neetoEditor.common.videoUrl")}
                name="url"
                placeholder={t("neetoEditor.placeholders.embedUrl")}
                size="medium"
                type="text"
              />
            </div>
            <ActionBlock
              cancelButtonProps={{
                "data-testid": "neeto-editor-video-embed-cancel",
                label: t("neetoEditor.common.cancel"),
                size: "sm",
                onClick: () => {
                  resetForm();
                  onClose();
                },
              }}
              submitButtonProps={{
                "data-testid": "neeto-editor-video-embed-submit",
                disabled: !dirty,
                label: t("neetoEditor.common.saveChanges"),
                loading: isSubmitting,
                size: "sm",
              }}
            />
          </>
        )}
      </Form>
    </div>
  );
};

export default VideoEmbedForm;
