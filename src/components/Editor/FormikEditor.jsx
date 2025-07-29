import { forwardRef, memo } from "react";

import { FastField } from "formik";
import { noop } from "neetocist";
import { path, pluck } from "ramda";

import Editor from ".";

const FormikEditor = (
  {
    name,
    onChange = noop,
    shouldUpdate,
    attachments = [],
    mentions = [],
    variables = [],
    ...otherProps
  },
  ref
) => {
  // Similar to the `shouldComponentUpdate` logic of FastField component.
  // https://github.com/jaredpalmer/formik/blob/main/packages/formik/src/FastField.tsx#L75-L93
  // Additionally calls the shouldUpdate function passed from the host application and compares to
  // the rest of the values.
  const internalShouldUpdate = (prevProps, nextProps) => {
    const prevFormikProps = prevProps.formik;
    const nextFormikProps = nextProps.formik;

    const pathParts = name.split(".");
    const prevError = path(pathParts, prevFormikProps.errors);
    const nextError = path(pathParts, nextFormikProps.errors);
    const prevTouched = path(pathParts, prevFormikProps.touched);
    const nextTouched = path(pathParts, nextFormikProps.touched);
    const prevAttachments = pluck("signedId", prevProps.attachments).join("|");
    const nextAttachments = pluck("signedId", nextProps.attachments).join("|");

    return (
      prevError !== nextError ||
      prevTouched !== nextTouched ||
      Object.keys(nextProps).length !== Object.keys(prevProps).length ||
      prevFormikProps.isSubmitting !== nextFormikProps.isSubmitting ||
      prevAttachments !== nextAttachments ||
      Boolean(shouldUpdate?.(prevProps, nextProps))
    );
  };

  return (
    <FastField
      {...{ attachments, mentions, name, variables }}
      shouldUpdate={internalShouldUpdate}
    >
      {({ field, form, meta }) => (
        <Editor
          {...{ attachments, mentions, name, ref, variables }}
          error={meta.touched ? meta.error : ""}
          initialValue={field.value}
          onBlur={() => {
            form.setFieldTouched(name, true);
          }}
          onChange={value => {
            form.setFieldValue(name, value);
            onChange?.(value);
          }}
          {...otherProps}
        />
      )}
    </FastField>
  );
};

FormikEditor.displayName = "FormikNeetoEditor";

export default memo(forwardRef(FormikEditor));
