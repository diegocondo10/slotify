import classNames from "classnames";

import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea";
import React from "react";
import { Controller } from "react-hook-form";
import { ControllerProps } from "./types";

export interface TextAreaProps
  extends Omit<InputTextareaProps, "name" | "defaultValue" | "ref" | "onChange"> {
  controller: ControllerProps;
  block?: boolean;
  loading?: boolean;
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { controller, block, loading, ...rest } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <React.Fragment>
          <InputTextarea
            id={field.name}
            {...rest}
            className={classNames(rest.className, { "w-full": block })}
            invalid={fieldState.invalid}
            disabled={loading}
            {...field}
          />
        </React.Fragment>
      )}
    />
  );
};

export default TextArea;
