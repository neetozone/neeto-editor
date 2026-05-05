import React from "react";

import { Formik, Form } from "formik";
import * as yup from "yup";

import { isEditorEmpty, FormikEditor, EditorContent } from "../../../src/v2";

import { VARIABLES } from "../../Examples/constants";

const INITIAL_VALUES = {
  description: "<p></p>",
};

const VALIDATION_SCHEMA = yup.object().shape({
  description: yup
    .string()
    .test(
      "description",
      "Description is required",
      value => !isEditorEmpty(value)
    ),
});

const App = () => (
  <Formik initialValues={INITIAL_VALUES} validationSchema={VALIDATION_SCHEMA}>
    {({ values }) => (
      <Form>
        <FormikEditor required name="description" variables={VARIABLES} />
        Content:
        <div className="p-6 border-2 mt-2">
          <EditorContent content={values.description} variables={VARIABLES} />
        </div>
      </Form>
    )}
  </Formik>
);

export default App;
