import { useEffect, useState } from "react";

import { ImageUploader } from "@bigbinary/neeto-image-uploader-frontend";
import { Dialog, Tabs, Toastr } from "@bigbinary/neeto-atoms";
import { isNotPresent } from "neetocist";
import { not } from "ramda";
import { useTranslation } from "react-i18next";

import directUploadsApi from "apis/direct_uploads";
import { getTabs } from "components/Editor/MediaUploader/utils";

import LocalUploader from "./LocalUploader";
import VideoEmbedForm from "./VideoEmbedForm";

const MediaUploader = ({
  mediaUploader,
  onClose,
  editor,
  showAssetLibrary = true,
}) => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("local");
  const [isUploading, setIsUploading] = useState(false);
  const isOpen = mediaUploader.image || mediaUploader.video;
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    isOpen && setTabs(getTabs(mediaUploader));
  }, [mediaUploader]);

  const handleClose = () => {
    onClose();
    setActiveTab("local");
    editor.commands.focus();
  };

  const insertMediaToEditor = file => {
    if (!editor) return;
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

  const onUploadComplete = async file => {
    try {
      await directUploadsApi.attach({ id: file.id, signed_id: file.signedId });
      insertMediaToEditor(file);
      handleClose();
    } catch (error) {
      Toastr.error(error);
    }
  };

  const onAttachVideo = url => {
    const file = { url, alt: "image" };
    insertMediaToEditor(file);
  };

  const onEmbedVideo = url => {
    if (!editor) return;
    editor.chain().focus().setExternalVideo({ src: url }).run();
  };

  const allowDismiss = not(isUploading);

  return (
    <Dialog
      {...{ isOpen }}
      className="ne-media-uploader-modal"
      closeButton={allowDismiss}
      onClose={allowDismiss ? handleClose : undefined}
    >
      <div className="ne-media-uploader">
        {(mediaUploader.video || mediaUploader.image) && (
          <div className="ne-media-uploader__header">
            <h2 className="ne-media-uploader__header-title">
              {mediaUploader.video && t("neetoEditor.menu.addVideo")}
              {mediaUploader.image && t("neetoEditor.menu.addImage")}
            </h2>
          </div>
        )}
        {!isNotPresent(tabs) && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List>
              {tabs.map(({ key, title }) => (
                <Tabs.Item
                  data-testid={`neeto-editor-media-uploader-${key}-tab`}
                  key={key}
                  value={key}
                >
                  {title}
                </Tabs.Item>
              ))}
            </Tabs.List>
          </Tabs>
        )}
        <div className="ne-media-uploader__content">
          {mediaUploader.image && (
            <ImageUploader
              {...{ onUploadComplete, showAssetLibrary }}
              className="ne-media-uploader__image-uploader"
            />
          )}
          {mediaUploader.video && (
            <>
              {activeTab === "local" && (
                <LocalUploader
                  {...{ insertMediaToEditor, setIsUploading }}
                  isImage={false}
                  onClose={handleClose}
                />
              )}
              {activeTab === "embed" && (
                <VideoEmbedForm
                  {...{ onAttachVideo, onEmbedVideo }}
                  onClose={handleClose}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default MediaUploader;
