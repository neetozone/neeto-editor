import { useState, useRef } from "react";

import { removeBy } from "neetocist";
import useOnClickOutside from "neetocommons/react-utils/useOnClickOutside";
import { withEventTargetValue } from "neetocommons/utils";
import { MenuVertical, Close, Check } from "neetoicons";
import {
  Dropdown,
  Input,
  Spinner,
  Toastr,
  Tooltip,
  Typography,
  Button,
  Alert,
} from "neetoui";
import { isEmpty, assoc } from "ramda";
import { Trans, useTranslation } from "react-i18next";

import directUploadsApi from "apis/direct_uploads";

import { ATTACHMENT_OPTIONS } from "./constants";
import { downloadFile } from "./utils";

import FileIcon from "../Common/FileIcon";

const { Menu, MenuItem } = Dropdown;

const Attachment = ({
  attachment,
  attachments,
  disabled,
  onChange,
  setSelectedAttachment,
  isLoading,
  allowDelete,
  allowOpenInNewTab,
}) => {
  const { t } = useTranslation();

  const [isRenaming, setIsRenaming] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newFilename, setNewFilename] = useState("");

  const renameRef = useRef(null);

  useOnClickOutside(renameRef, () => {
    if (!isRenaming) return;
    setIsRenaming(false);
    setNewFilename("");
  });

  const handleDownload = () =>
    downloadFile(attachment.url, attachment.filename);

  const handleOpenInNewTab = () =>
    window.open(attachment.url, "_blank", "noopener,noreferrer");

  const handleRename = async () => {
    try {
      setIsUpdating(true);
      const { signedId } = attachment;
      const payload = { blob: { filename: newFilename } };

      const response = await directUploadsApi.update({ signedId, payload });
      const filename = response.data?.blob?.filename || response.blob.filename;

      onChange(
        attachments.map(attachment =>
          attachment.signedId === signedId
            ? assoc("filename", filename, attachment)
            : attachment
        )
      );
    } catch (error) {
      Toastr.error(error);
    } finally {
      setIsRenaming(false);
      setIsUpdating(false);
      setNewFilename("");
    }
  };

  const handleDelete = async () => {
    if (!allowDelete) return;

    setIsDeleting(true);
    try {
      const { signedId } = attachment;
      await directUploadsApi.destroy(signedId);
      onChange(removeBy({ signedId }, attachments));
    } catch (error) {
      Toastr.error(error);
    }
  };

  const handlers = {
    ...(allowOpenInNewTab && {
      [ATTACHMENT_OPTIONS.OPEN_IN_NEW_TAB]: handleOpenInNewTab,
    }),
    [ATTACHMENT_OPTIONS.DOWNLOAD]: handleDownload,
    [ATTACHMENT_OPTIONS.RENAME]: handleRename,
    ...(allowDelete && { [ATTACHMENT_OPTIONS.DELETE]: handleDelete }),
  };

  const onMenuItemClick = ({ key, handler }) => {
    if (key === ATTACHMENT_OPTIONS.RENAME) {
      setIsRenaming(true);
      setNewFilename(attachment.filename);
    } else if (key === ATTACHMENT_OPTIONS.DELETE) {
      setNewFilename(attachment.filename);
      setIsDeleteAlertOpen(true);
    } else {
      handler();
    }
  };

  const handleKeyDown = ({ event, key }) => {
    const handler = handlers[key];

    if (event.key === "Enter" && handler && !isEmpty(newFilename)) {
      event.stopPropagation();
      event.preventDefault();
      handler();
    }

    if (event.key === "Escape") {
      setIsRenaming(false);
      setNewFilename("");
    }
  };

  return (
    <>
      <div
        className="ne-attachments__preview"
        data-testid="ne-attachments-wrapper"
      >
        {isRenaming ? (
          <div ref={renameRef}>
            <Tooltip content={newFilename} position="top">
              <Input
                autoFocus
                data-testid="neeto-editor-preview-rename-input"
                size="small"
                value={newFilename}
                error={
                  isEmpty(newFilename)
                    ? t("neetoEditor.attachments.nameEmpty")
                    : ""
                }
                suffix={
                  <div className="flex items-center justify-end">
                    <Button
                      data-testid="neeto-editor-preview-rename-submit-button"
                      disabled={isEmpty(newFilename) || isUpdating}
                      icon={Check}
                      loading={isUpdating}
                      size="small"
                      style="text"
                      onClick={handleRename}
                    />
                    <Button
                      data-testid="neeto-editor-preview-rename-cancel-button"
                      disabled={isUpdating}
                      icon={Close}
                      size="small"
                      style="text"
                      onClick={() => {
                        setIsRenaming(false);
                        setNewFilename("");
                      }}
                    />
                  </div>
                }
                onChange={withEventTargetValue(setNewFilename)}
                onKeyDown={event =>
                  handleKeyDown({
                    event,
                    key: ATTACHMENT_OPTIONS.RENAME,
                  })
                }
              />
            </Tooltip>
          </div>
        ) : (
          <>
            <div
              className="ne-attachments__preview-wrapper"
              onClick={() => setSelectedAttachment(attachment)}
            >
              <FileIcon
                className="ne-attachments__preview-wrapper__icon"
                fileName={attachment.filename}
              />
              <Tooltip content={attachment.filename} position="top">
                <Typography style="body2">{attachment.filename}</Typography>
              </Tooltip>
              {isLoading && <Spinner className="attachment-button-loader" />}
            </div>
            <Tooltip
              content={t("neetoEditor.attachments.actionsBlocked")}
              disabled={!disabled}
              position="top"
            >
              <Dropdown
                {...{ disabled }}
                buttonSize="small"
                buttonStyle="text"
                icon={MenuVertical}
              >
                <Menu>
                  {Object.entries(handlers).map(([label, handler]) => (
                    <MenuItem.Button
                      data-testid={`neeto-editor-preview-${label.toLowerCase()}-button`}
                      key={label}
                      onClick={() => onMenuItemClick({ key: label, handler })}
                    >
                      {t(label)}
                    </MenuItem.Button>
                  ))}
                </Menu>
              </Dropdown>
            </Tooltip>
          </>
        )}
      </div>
      <Alert
        isOpen={isDeleteAlertOpen}
        isSubmitting={isDeleting}
        submitButtonLabel={t("neetoEditor.menu.delete")}
        title={t("neetoEditor.attachments.deleteTitle")}
        message={
          <Trans
            i18nKey="neetoEditor.attachments.deleteConfirmation"
            values={{ entity: newFilename }}
          />
        }
        onClose={() => setIsDeleteAlertOpen(false)}
        onSubmit={handleDelete}
      />
    </>
  );
};

export default Attachment;
