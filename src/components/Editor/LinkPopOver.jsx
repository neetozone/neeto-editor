import { useEffect, useState, useRef } from "react";

import { getMarkRange, getMarkType } from "@tiptap/react";
import classnames from "classnames";
import { useOnClickOutside } from "neetocommons/react-utils";
import { Edit, Form as NeetoUIFormIcon } from "neetoicons";
import CopyToClipboardButton from "neetomolecules/CopyToClipboardButton";
import { Button, Checkbox, Modal } from "neetoui";
import { Form, Input, Select } from "neetoui/formik";
import { equals, isNil } from "ramda";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import neetoKbApi from "src/apis/neeto_kb";
import { decodeHtmlEntities } from "src/utils/common";

import { LINK_VALIDATION_SCHEMA } from "./constants";
import { formatOptionLabel } from "./CustomExtensions/LinkKbArticles/utils";
import { getLinkPopoverPosition } from "./Menu/Fixed/utils";
import { validateAndFormatUrl } from "./utils";

const LinkPopOver = ({ editor, deletedArticlesHook }) => {
  const { view } = editor || {};
  const { from } = editor.state.selection;
  const initialTextContent = view?.state?.doc?.nodeAt(from)?.text || "";

  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isLinkActive, setIsLinkActive] = useState(editor?.isActive("link"));

  // KB Article editing states
  const [categories, setCategories] = useState([]);
  const [isLoadingKbData, setIsLoadingKbData] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);

  const [currentSelectView, setCurrentSelectView] = useState("categories"); // "categories" | "articles"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  // Deleted article modal state
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  const popoverRef = useRef(null);

  const { t } = useTranslation();

  const linkAttributes = editor?.getAttributes("link");
  const isNeetoKbArticle = linkAttributes?.["data-neeto-kb-article"] === "true";

  useEffect(() => {
    if (isEditing && isNeetoKbArticle) {
      fetchKbDataForEditing();
    }
  }, [isEditing, isNeetoKbArticle]);

  const fetchKbDataForEditing = async () => {
    setIsLoadingKbData(true);
    try {
      // Initially fetch only categories
      const categoriesResponse = await neetoKbApi.fetchCategories();
      const categoriesData =
        categoriesResponse.categories ||
        categoriesResponse.data?.categories ||
        [];

      setCategories(categoriesData);

      // Build category options for select
      const categoryOptions = categoriesData.map(category => ({
        label: decodeHtmlEntities(category.name),
        value: category.id,
        data: { type: "category", ...category },
      }));

      setSelectOptions(categoryOptions);
      setCurrentSelectView("categories");
    } catch (error) {
      // Error handling for KB data fetch
    } finally {
      setIsLoadingKbData(false);
    }
  };

  const fetchArticlesForCategory = async categoryId => {
    setIsLoadingArticles(true);
    try {
      const response = await neetoKbApi.fetchArticlesByCategory(categoryId);
      const articlesData = response.articles || response.data?.articles || [];

      // Build article options for select
      const articleOptions = articlesData.map(article => ({
        label: article.title,
        value: article.id,
        data: { type: "article", ...article },
      }));

      setSelectOptions(articleOptions);
      setCurrentSelectView("articles");
    } catch (error) {
      // Error handling for articles fetch
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const handleSelectChange = (value, { setFieldValue }) => {
    // Handle back to categories
    if (value?.value === "__back_to_categories__") {
      handleBackToCategories({ setFieldValue });

      return;
    }

    const selectedOption = selectOptions.find(
      option => option.value === value?.value
    );

    if (selectedOption?.data?.type === "category") {
      // Category selected - fetch its articles
      setSelectedCategory(selectedOption.data);
      fetchArticlesForCategory(selectedOption.data.id);
      // Don't set the field value yet as we're not done selecting
    } else if (selectedOption?.data?.type === "article") {
      // Article selected - set the form value
      setFieldValue("pageSelection", value);
    }
  };

  const handleBackToCategories = ({ setFieldValue }) => {
    setCurrentSelectView("categories");
    setSelectedCategory(null);
    setFieldValue("pageSelection", ""); // Clear selection

    // Rebuild category options
    const categoryOptions = (categories || []).map(category => ({
      label: decodeHtmlEntities(category.name),
      value: category.id,
      data: { type: "category", ...category },
    }));

    setSelectOptions(categoryOptions);
  };

  const updatePopoverPosition = () => {
    if (!view) return;

    const { arrowPosition, popoverPosition } = getLinkPopoverPosition(
      editor,
      popoverRef
    );

    setPopoverPosition({
      top: parseInt(popoverPosition.top),
      left: parseInt(popoverPosition.left),
    });

    setArrowPosition({
      top: parseInt(arrowPosition.top),
      left: parseInt(arrowPosition.left),
    });
  };

  const handleUnlink = () =>
    editor.chain().focus().extendMarkRange("link").unsetLink().run();

  const removePopover = () => {
    setIsEditing(false);
    setIsLinkActive(false);
  };

  const popoverStyle = {
    display: "block",
    position: "fixed",
    top: popoverPosition.top,
    left: popoverPosition.left,
    transform: `translateY(52px) translateX(${isEditing ? "8px" : "3px"})`,
  };

  const handleSubmit = ({ textContent, urlString, openInNewTab }) => {
    const formattedUrl = validateAndFormatUrl(urlString);
    if (equals(textContent, initialTextContent)) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formattedUrl, target: openInNewTab ? "_blank" : null })
        .run();
      setIsEditing(false);

      return;
    }
    const { state, dispatch } = editor.view;
    const type = getMarkType("link", state.schema);
    const { $to } = state.selection;
    const { from = null, to = null } = getMarkRange($to, type) || {};

    if (isNil(from) || isNil(to)) return;

    const attrs = {
      href: formattedUrl,
      target: openInNewTab ? "_blank" : null,
    };
    const linkMark = state.schema.marks.link.create(attrs);
    const linkTextWithMark = state.schema.text(textContent, [linkMark]);

    const tr = state.tr.replaceWith(from, to, linkTextWithMark);

    dispatch(tr);

    setIsEditing(false);
    editor.view.focus();
    editor.commands.extendMarkRange("link");
  };

  const handleKbArticleSubmit = async ({ textContent, pageSelection }) => {
    try {
      // If no article was selected (just text change), update the existing link
      if (!pageSelection || pageSelection === "") {
        // Just update the text of the existing link without changing the href
        const { state, dispatch } = editor.view;
        const type = getMarkType("link", state.schema);
        const { $to } = state.selection;
        const { from = null, to = null } = getMarkRange($to, type) || {};

        if (isNil(from) || isNil(to)) return;

        // Keep existing link attributes but update the text
        const attrs = {
          href: linkAttributes?.href,
          "data-neeto-kb-article": linkAttributes?.["data-neeto-kb-article"],
          "data-article-id": linkAttributes?.["data-article-id"],
          title: textContent || linkAttributes?.title,
        };

        const linkMark = state.schema.marks.link.create(attrs);
        const linkTextWithMark = state.schema.text(textContent, [linkMark]);

        const tr = state.tr.replaceWith(from, to, linkTextWithMark);
        dispatch(tr);

        setIsEditing(false);
        editor.view.focus();
        editor.commands.extendMarkRange("link");

        return;
      }

      // Find the selected option data (existing logic for when article is changed)
      const selectedOption = selectOptions.find(
        option => option.value === pageSelection?.value
      );

      if (!selectedOption) return;

      const { data } = selectedOption;
      let articleData = null;

      if (data?.type === "article") {
        // If article is selected, fetch its details
        const response = await neetoKbApi.fetchArticle(data.id);
        articleData = response.article || response.data?.article || response;
      }

      if (articleData && articleData.full_url) {
        const { state, dispatch } = editor.view;
        const type = getMarkType("link", state.schema);
        const { $to } = state.selection;
        const { from = null, to = null } = getMarkRange($to, type) || {};

        if (isNil(from) || isNil(to)) return;

        // Create new link with updated attributes
        const attrs = {
          href: articleData.full_url,
          "data-neeto-kb-article": "true",
          "data-article-id": articleData.id,
          title: articleData.title,
        };

        const linkMark = state.schema.marks.link.create(attrs);
        const linkTextWithMark = state.schema.text(
          textContent || articleData.title,
          [linkMark]
        );

        const tr = state.tr.replaceWith(from, to, linkTextWithMark);
        dispatch(tr);

        setIsEditing(false);
        editor.view.focus();
        editor.commands.extendMarkRange("link");
      }
    } catch (error) {
      // Error handling for KB article update
    }
  };

  const handleKeyDown = event =>
    equals(event.key, "Escape") && setIsEditing(false);

  useOnClickOutside(popoverRef, removePopover, { enabled: true });

  // DISABLED because this was interfering with any popover in the editor and closing it which also includes the
  // components inside the Popover. This may not cause any other issue.

  /*
  useEffect(() => {
    window.addEventListener("resize", removePopover);
    window.addEventListener("wheel", removePopover);

    return () => {
      window.removeEventListener("resize", removePopover);
      window.removeEventListener("wheel", removePopover);
    };
  }, []);
  */

  useEffect(() => {
    const isActive = editor?.isActive("link");
    setIsLinkActive(isActive);
    if (isActive) {
      updatePopoverPosition();
    }
  }, [view?.state?.selection?.$from?.pos, isEditing]);

  const getCurrentArticleOption = () => {
    const articleId = linkAttributes?.["data-article-id"];
    if (!articleId) return "";

    // If we have an article ID but are in categories view,
    // we need to construct the option from link attributes
    if (currentSelectView === "categories") {
      if (linkAttributes?.title) {
        return { label: linkAttributes.title, value: articleId };
      }

      return "";
    }

    // If we're in articles view, find the matching article from selectOptions
    const currentArticleOption = (selectOptions || []).find(
      option => option.data?.type === "article" && option.data?.id === articleId
    );

    return currentArticleOption || "";
  };

  const renderEditingMode = () => (
    <Form
      formikProps={{
        initialValues: {
          textContent: initialTextContent,
          urlString: linkAttributes?.href || "",
          openInNewTab: linkAttributes?.target === "_blank",
        },
        onSubmit: handleSubmit,
        validationSchema: LINK_VALIDATION_SCHEMA,
      }}
    >
      {({ dirty, isSubmitting, setFieldValue, values }) => (
        <>
          <Input
            required
            unlimitedChars
            data-cy="neeto-editor-edit-link-text-input"
            label={t("neetoEditor.common.text")}
            name="textContent"
            placeholder={t("neetoEditor.placeholders.enterText")}
            style={{ width: "250px" }}
            onKeyDown={handleKeyDown}
          />
          <Input
            autoFocus
            required
            unlimitedChars
            className="ne-link-popover__url-input"
            data-cy="neeto-editor-edit-link-url-input"
            label={t("neetoEditor.common.url")}
            name="urlString"
            placeholder={t("neetoEditor.placeholders.url")}
            style={{ width: "250px" }}
            onKeyDown={handleKeyDown}
          />
          <Checkbox
            checked={values.openInNewTab}
            className="ne-link-popover__checkbox"
            label={t("neetoEditor.common.openInNewTab")}
            onChange={() => {
              setFieldValue("openInNewTab", !values.openInNewTab);
            }}
          />
          <div className="ne-link-popover__edit-prompt-buttons">
            <Button
              data-cy="neeto-editor-edit-link"
              disabled={!dirty}
              label={t("neetoEditor.menu.link")}
              loading={isSubmitting}
              size="small"
              type="submit"
            />
            <Button
              data-cy="neeto-editor-edit-link-cancel"
              label={t("neetoEditor.common.cancel")}
              size="small"
              style="text"
              onClick={() => setIsEditing(false)}
            />
          </div>
        </>
      )}
    </Form>
  );

  const renderEditingModeForKbArticle = () => (
    <Form
      formikProps={{
        initialValues: {
          textContent: linkAttributes?.title || initialTextContent,
          pageSelection: getCurrentArticleOption(),
        },
        onSubmit: handleKbArticleSubmit,
      }}
    >
      {({ dirty, isSubmitting, setFieldValue, values }) => (
        <>
          <Input
            required
            unlimitedChars
            data-cy="neeto-editor-edit-kb-link-text-input"
            label="Text"
            name="textContent"
            placeholder="Enter link text"
            style={{ width: "300px" }}
            onKeyDown={handleKeyDown}
          />
          <Select
            {...{ formatOptionLabel }}
            isSearchable
            data-cy="neeto-editor-edit-kb-link-page-select"
            isLoading={isLoadingKbData || isLoadingArticles}
            label={currentSelectView === "categories" ? "Category" : "Article"}
            name="pageSelection"
            strategy="fixed"
            style={{ width: "300px" }}
            value={values.pageSelection}
            options={
              currentSelectView === "articles"
                ? [
                    {
                      label: "← Back",
                      value: "__back_to_categories__",
                      data: { type: "back" },
                    },
                    ...selectOptions,
                  ]
                : selectOptions
            }
            placeholder={
              currentSelectView === "categories"
                ? "Select a category"
                : decodeHtmlEntities(
                    `Select an article from ${
                      selectedCategory?.name || "category"
                    }`
                  )
            }
            onChange={value => handleSelectChange(value, { setFieldValue })}
          />
          <div className="ne-link-popover__edit-prompt-buttons">
            <Button
              data-cy="neeto-editor-edit-kb-link-done"
              disabled={!dirty}
              label="Done"
              loading={isSubmitting}
              size="small"
              type="submit"
            />
            <Button
              data-cy="neeto-editor-edit-kb-link-cancel"
              label="Cancel"
              size="small"
              style="text"
              onClick={() => setIsEditing(false)}
            />
          </div>
        </>
      )}
    </Form>
  );

  const renderViewModeForKbArticle = () => {
    const articleId = linkAttributes?.["data-article-id"];
    const isDeleted = true || deletedArticlesHook?.isArticleDeleted(articleId);

    return (
      <div>
        <div className="flex items-center gap-2">
          <NeetoUIFormIcon className="neeto-ui-text-gray-600" size={16} />
          <a
            href={linkAttributes?.href}
            rel="noreferrer"
            target="_blank"
            className={classnames(
              "flex-1 truncate",
              isDeleted ? "neeto-ui-text-red-500" : "neeto-ui-text-blue-500"
            )}
            onClick={event => {
              if (!isDeleted) return;
              event.preventDefault();
              removePopover();
              setShowDeletedModal(true);
            }}
          >
            {linkAttributes?.title || linkAttributes?.href}
          </a>
          <CopyToClipboardButton
            size="small"
            style="tertiary"
            value={linkAttributes?.href}
          />
          <Button
            className="ne-link-popover__option-button"
            data-cy="neeto-editor-link-popover-edit"
            icon={Edit}
            size="small"
            style="text"
            tooltipProps={{
              content: t("neetoEditor.common.edit"),
              position: "top",
            }}
            onClick={() => setIsEditing(true)}
          />
        </div>
        {isDeleted && (
          <div className="neeto-ui-rounded mt-2 p-2 text-sm">
            This article has been deleted. Please link a valid article.
          </div>
        )}
      </div>
    );
  };

  const renderViewMode = () => (
    <>
      <a href={linkAttributes?.href} rel="noreferrer" target="_blank">
        {linkAttributes?.href}
      </a>
      {" - "}
      <Button
        className="ne-link-popover__option-button"
        data-cy="neeto-editor-link-popover-edit"
        label={t("neetoEditor.common.edit")}
        size="small"
        style="link"
        onClick={() => setIsEditing(true)}
      />
      <span>|</span>
      <Button
        className="ne-link-popover__option-button"
        data-cy="neeto-editor-link-popover-unlink"
        label={t("neetoEditor.common.unlink")}
        size="small"
        style="link"
        onClick={handleUnlink}
      />
    </>
  );

  return (
    <>
      {createPortal(
        isLinkActive ? (
          <>
            <div
              className="ne-link-arrow fade-in"
              style={{ top: arrowPosition.top, left: arrowPosition.left }}
            />
            <div
              className="ne-link-popover fade-in"
              id="ne-link-view-popover"
              ref={popoverRef}
              style={popoverStyle}
            >
              {isEditing
                ? isNeetoKbArticle
                  ? renderEditingModeForKbArticle()
                  : renderEditingMode()
                : isNeetoKbArticle
                ? renderViewModeForKbArticle()
                : renderViewMode()}
            </div>
          </>
        ) : null,
        document.body
      )}
      {/* Deleted Article Modal */}
      <Modal
        isOpen={showDeletedModal}
        onClose={() => setShowDeletedModal(false)}
      >
        <Modal.Header>
          <h2>The article has been deleted</h2>
        </Modal.Header>
        <Modal.Body>
          <p>
            The article you are looking for is no longer available. It may have
            been removed or the link is outdated.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button label="Close" onClick={() => setShowDeletedModal(false)} />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LinkPopOver;
