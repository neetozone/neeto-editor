import { memo } from "react";

import classnames from "classnames";
import { isNotPresent } from "neetocist";
import { is } from "ramda";

const ErrorWrapper = ({ error, children, className }) => {
  const isError = !isNotPresent(error);
  const wrapperClasses = classnames({
    "neeto-editor-error": isError,
    [className]: className,
  });

  const getErrorMessage = () => {
    if (!error) return null;

    let message;

    if (is(String, error)) {
      message = error;
    } else if (is(Array, error)) {
      message = error[0];
    } else if (is(Object, error)) {
      message = error.message;
    }

    if (isNotPresent(message)) return null;

    return message;
  };

  return (
    <>
      <div className={wrapperClasses}>{children}</div>
      {isError && (
        <p className="neeto-ui-input__error" data-testid="neeto-editor-error-text">
          {getErrorMessage()}
        </p>
      )}
    </>
  );
};

export default memo(ErrorWrapper);
