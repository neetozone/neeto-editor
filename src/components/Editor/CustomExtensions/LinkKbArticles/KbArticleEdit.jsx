import React from "react";

import { Button } from "neetoui";
import { Form, Input } from "neetoui/formik";
import { useTranslation } from "react-i18next";

import { decodeHtmlEntities } from "src/utils/common";

import ArticlePicker from "./ArticlePicker";
import { MODE } from "./constants";

const KbArticleEdit = ({
  linkAttributes,
  getCurrentTextContent,
  getCurrentArticleOption,
  handleKbArticleSubmit,
  handleSelectChange,
  handleKeyDown,
  isLoadingKbData,
  selectOptions,
  setIsEditing,
}) => {
  const initialValues = {
    textContent:
      getCurrentTextContent?.() ||
      decodeHtmlEntities(linkAttributes?.title || "") ||
      "",
    pageSelection: getCurrentArticleOption(),
  };

  const { t } = useTranslation();

  return (
    <Form
      className="w-64"
      formikProps={{
        initialValues,
        onSubmit: handleKbArticleSubmit,
        enableReinitialize: true,
      }}
    >
      {({ dirty, isSubmitting, setFieldValue, values }) => (
        <div className="flex w-full flex-col items-start gap-2">
          <Input
            required
            unlimitedChars
            className="w-full"
            data-testid="neeto-editor-edit-kb-link-text-input"
            label={t("neetoEditor.common.text")}
            name="textContent"
            placeholder={t("neetoEditor.placeholders.enterText")}
            onKeyDown={handleKeyDown}
          />
          <ArticlePicker
            className="w-full"
            data-testid="neeto-editor-edit-kb-link-page-select"
            isLoading={isLoadingKbData}
            label={t("neetoEditor.linkKb.articleLabel")}
            mode={MODE.SELECT}
            name="pageSelection"
            options={selectOptions}
            placeholder={t("neetoEditor.linkKb.selectArticle")}
            strategy="fixed"
            value={values.pageSelection}
            onChange={value => handleSelectChange(value, { setFieldValue })}
          />
          <div className="ne-link-popover__edit-prompt-buttons">
            <Button
              data-testid="neeto-editor-edit-kb-link-done"
              disabled={!dirty}
              label={t("neetoEditor.common.done")}
              loading={isSubmitting}
              size="small"
              type="submit"
            />
            <Button
              data-testid="neeto-editor-edit-kb-link-cancel"
              label={t("neetoEditor.common.cancel")}
              size="small"
              style="text"
              onClick={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </Form>
  );
};

export default KbArticleEdit;
