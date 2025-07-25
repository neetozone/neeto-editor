import { useEffect, useState } from "react";

import { isNotPresent } from "neetocist";
import { Modal, Tab } from "neetoui";
import { not } from "ramda";
import { useTranslation } from "react-i18next";

import LocalUploader from "./LocalUploader";
import UnsplashImagePicker from "./UnsplashImagePicker";
import URLForm from "./URLForm";
import { getTabs } from "./utils";
import VideoEmbedForm from "./VideoEmbedForm";

import { validateUrl } from "../CustomExtensions/Embeds/utils";

const MediaUploader = ({ mediaUploader, onClose, editor, unsplashApiKey }) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("local");
  const [isUploading, setIsUploading] = useState(false);
  const isOpen = mediaUploader.image || mediaUploader.video;
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    isOpen && setTabs(getTabs(mediaUploader, unsplashApiKey));
  }, [mediaUploader]);

  const handleClose = () => {
    onClose();
    setActiveTab("local");
    editor.commands.focus();
  };

  const handleSubmit = url => {
    insertMediaToEditor({ url, alt: "image" });
    handleClose();
  };

  const handleVideoEmbed = url => {
    const validatedUrl = validateUrl(url);
    if (validatedUrl) {
      editor.chain().focus().setExternalVideo({ src: validatedUrl }).run();
      handleClose();
    }
  };

  const insertMediaToEditor = file => {
    const { url, filename = "image", caption = "" } = file;
    const mediaAttrs = { src: url, caption, alt: filename };
    const setMedia = mediaUploader.image
      ? editor.chain().setFigure(mediaAttrs)
      : editor.chain().setVideo(mediaAttrs);

    setMedia
      .focus()
      .command(({ tr, commands }) => {
        const { doc, selection } = tr;
        const position = doc.resolve(selection.to).end() + 1;
        const safePosition = Math.min(position, doc.content.size);

        return commands.insertContentAt(safePosition, "<p></p>");
      })
      .run();
  };

  return (
    <Modal
      {...{ isOpen }}
      className="ne-media-uploader-modal"
      closeButton={not(isUploading)}
      closeOnOutsideClick={not(isUploading)}
      onClose={handleClose}
    >
      <div className="ne-media-uploader">
        {mediaUploader.video && (
          <div className="ne-media-uploader__header">
            <h2 className="ne-media-uploader__header-title">
              {t("neetoEditor.menu.addVideo")}
            </h2>
          </div>
        )}
        {!isNotPresent(tabs) && (
          <Tab>
            {tabs.map(({ key, title }) => (
              <Tab.Item
                active={activeTab === key}
                data-cy={`neeto-editor-media-uploader-${key}-tab`}
                key={key}
                onClick={() => setActiveTab(key)}
              >
                {title}
              </Tab.Item>
            ))}
          </Tab>
        )}
        <div className="ne-media-uploader__content">
          {activeTab === "local" && (
            <LocalUploader
              {...{ insertMediaToEditor, setIsUploading }}
              isImage={mediaUploader.image}
              onClose={handleClose}
            />
          )}
          {activeTab === "link" && (
            <URLForm
              placeholder={t("neetoEditor.placeholders.pasteLink")}
              buttonLabel={
                mediaUploader.image
                  ? t("neetoEditor.localUploader.uploadImage")
                  : t("neetoEditor.localUploader.uploadVideo")
              }
              onSubmit={handleSubmit}
            />
          )}
          {activeTab === "unsplash" && (
            <UnsplashImagePicker
              {...{ unsplashApiKey }}
              onSubmit={handleSubmit}
            />
          )}
          {activeTab === "embed" && mediaUploader.video && (
            <VideoEmbedForm
              onCancel={handleClose}
              onSubmit={handleVideoEmbed}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MediaUploader;
