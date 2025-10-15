import { useEffect, useState, useRef } from "react";

import { getMarkRange, getMarkType } from "@tiptap/react";
import { findBy } from "neetocist";
import { useOnClickOutside } from "neetocommons/react-utils";
import { Button, Checkbox } from "neetoui";
import { Form, Input } from "neetoui/formik";
import { equals, isNil } from "ramda";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import neetoKbApi from "src/apis/neeto_kb";
import { decodeHtmlEntities } from "src/utils/common";

import { LINK_VALIDATION_SCHEMA } from "./constants";
import KbArticleDeletedModal from "./CustomExtensions/LinkKbArticles/KbArticleDeletedModal";
import KbArticleEdit from "./CustomExtensions/LinkKbArticles/KbArticleEdit";
import KbArticleView from "./CustomExtensions/LinkKbArticles/KbArticleView";
import { buildArticleFullUrl } from "./CustomExtensions/LinkKbArticles/utils";
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

  const [isLoadingKbData, setIsLoadingKbData] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);

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
    const articlesResponse = await neetoKbApi.fetchArticles({});
    const articlesData =
      articlesResponse.articles || articlesResponse.data?.articles || [];

    const articleOptions = articlesData.map(article => ({
      label: decodeHtmlEntities(article.title),
      value: article.id,
      data: { type: "article", ...article },
    }));

    setSelectOptions(articleOptions);
    setIsLoadingKbData(false);
  };

  const handleSelectChange = (value, { setFieldValue }) => {
    const selectedOption = findBy({ value: value?.value }, selectOptions);

    if (selectedOption?.data?.type === "article") {
      setFieldValue("pageSelection", value);
    }
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

  const handleKbArticleSubmit = ({ textContent, pageSelection }) => {
    if (!pageSelection || pageSelection === "") {
      const { state, dispatch } = editor.view;
      const type = getMarkType("link", state.schema);
      const { $to } = state.selection;
      const { from = null, to = null } = getMarkRange($to, type) || {};

      if (isNil(from) || isNil(to)) return;

      const articleId = linkAttributes?.["data-article-id"];
      const isDeleted = deletedArticlesHook?.isArticleDeleted(articleId);

      const attrs = {
        href: linkAttributes?.href,
        "data-neeto-kb-article": linkAttributes?.["data-neeto-kb-article"],
        "data-article-id": articleId,
        "data-article-deleted": isDeleted ? "true" : null,
        title: textContent || decodeHtmlEntities(linkAttributes?.title || ""),
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

    const selectedOption = findBy(
      { value: pageSelection?.value },
      selectOptions
    );

    if (!selectedOption) return;

    const { data } = selectedOption;

    if (data?.type === "article") {
      const full_url = buildArticleFullUrl(data.slug);

      if (full_url) {
        const { state, dispatch } = editor.view;
        const type = getMarkType("link", state.schema);
        const { $to } = state.selection;
        const { from = null, to = null } = getMarkRange($to, type) || {};

        if (isNil(from) || isNil(to)) return;

        const isDeleted = deletedArticlesHook?.isArticleDeleted(data.id);

        const attrs = {
          href: full_url,
          "data-neeto-kb-article": "true",
          "data-article-id": data.id,
          "data-article-deleted": isDeleted ? "true" : null,
          title: decodeHtmlEntities(data.title || ""),
        };

        const linkMark = state.schema.marks.link.create(attrs);
        const linkTextWithMark = state.schema.text(
          textContent || decodeHtmlEntities(data.title || ""),
          [linkMark]
        );

        const tr = state.tr.replaceWith(from, to, linkTextWithMark);
        dispatch(tr);

        setIsEditing(false);
        editor.view.focus();
        editor.commands.extendMarkRange("link");
      }
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

    const currentArticleOption = findBy(
      { data: { type: "article", id: articleId } },
      selectOptions || []
    );

    if (!currentArticleOption && linkAttributes?.title) {
      return {
        label: decodeHtmlEntities(linkAttributes.title),
        value: articleId,
      };
    }

    return currentArticleOption || "";
  };

  const getCurrentTextContent = () => {
    const { state } = editor.view;
    const type = getMarkType("link", state.schema);
    const { $to } = state.selection;
    const { from = null, to = null } = getMarkRange($to, type) || {};

    if (from !== null && to !== null) {
      return state.doc.textBetween(from, to);
    }
    const { $from } = state.selection;

    return state.doc.textBetween($from.pos, $to.pos);
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
    <KbArticleEdit
      {...{
        getCurrentArticleOption,
        getCurrentTextContent,
        handleKbArticleSubmit,
        handleKeyDown,
        handleSelectChange,
        isLoadingKbData,
        linkAttributes,
        selectOptions,
        setIsEditing,
      }}
    />
  );

  const renderViewModeForKbArticle = () => {
    const articleId = linkAttributes?.["data-article-id"];
    const isDeleted = deletedArticlesHook?.isArticleDeleted(articleId);

    return (
      <KbArticleView
        {...{ isDeleted, linkAttributes }}
        currentText={getCurrentTextContent()}
        onEdit={() => setIsEditing(true)}
        onDeletedClick={() => {
          removePopover();
          setShowDeletedModal(true);
        }}
      />
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

  const renderPopoverContent = () => {
    if (isEditing) {
      return isNeetoKbArticle
        ? renderEditingModeForKbArticle()
        : renderEditingMode();
    }

    return isNeetoKbArticle ? renderViewModeForKbArticle() : renderViewMode();
  };

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
              {renderPopoverContent()}
            </div>
          </>
        ) : null,
        document.body
      )}
      <KbArticleDeletedModal
        isOpen={showDeletedModal}
        onClose={() => setShowDeletedModal(false)}
      />
    </>
  );
};

export default LinkPopOver;
