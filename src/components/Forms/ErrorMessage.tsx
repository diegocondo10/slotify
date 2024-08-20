import { ErrorMessage as HookErrorMessage } from "@hookform/error-message";
import React from "react";

const ErrorMessage: React.FC<{ name: string }> = ({ name }) => {
  return (
    <HookErrorMessage
      name={name}
      render={({ message }) => (
        <small className='p-error' style={{ fontSize: "14px" }}>
          {message}
        </small>
      )}
    />
  );
};

export default ErrorMessage;
