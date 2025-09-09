import React from "react";

import { withT } from "neetocommons/react-utils";
import { Button, Input, Select } from "neetoui";
import { Form } from "neetoui/formik";

import { decodeHtmlEntities } from "src/utils/common";

const KbArticleEdit = withT(
  ({
    t,
    linkAttributes,
    initialTextContent,
    getCurrentArticleOption,
    handleKbArticleSubmit,
    handleSelectChange,
    handleKeyDown,
    isLoadingKbData,
    selectOptions,
    setIsEditing,
  }) => (
    <Form
      formikProps={{
        initialValues: {
          textContent:
            (linkAttributes?.title &&
              decodeHtmlEntities(linkAttributes.title)) ||
            initialTextContent ||
            "",
          pageSelection: getCurrentArticleOption(),
        },
        onSubmit: handleKbArticleSubmit,
        enableReinitialize: true,
      }}
    >
      {({ dirty, isSubmitting, setFieldValue, values }) => (
        <div className="flex w-full flex-col items-start gap-2">
          <Input
            required
            className="w-full"
            data-cy="neeto-editor-edit-kb-link-text-input"
            label={t("neetoEditor.common.text")}
            name="textContent"
            placeholder={t("neetoEditor.placeholders.enterText")}
            value={values.textContent}
            onChange={e => setFieldValue("textContent", e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Select
            isSearchable
            className="w-ful"
            data-cy="neeto-editor-edit-kb-link-page-select"
            isLoading={isLoadingKbData}
            label={t("neetoEditor.linkKb.articleLabel")}
            name="pageSelection"
            options={selectOptions}
            placeholder={t("neetoEditor.linkKb.selectArticle")}
            strategy="fixed"
            value={values.pageSelection}
            onChange={value => handleSelectChange(value, { setFieldValue })}
          />
          <div className="ne-link-popover__edit-prompt-buttons">
            <Button
              data-cy="neeto-editor-edit-kb-link-done"
              disabled={!dirty}
              label={t("neetoEditor.common.done")}
              loading={isSubmitting}
              size="small"
              type="submit"
            />
            <Button
              data-cy="neeto-editor-edit-kb-link-cancel"
              label={t("neetoEditor.common.cancel")}
              size="small"
              style="text"
              onClick={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </Form>
  )
);

export default KbArticleEdit;
