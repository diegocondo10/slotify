import classNames from "classnames";
import { InputText, InputTextProps } from "primereact/inputtext";
import React from "react";
import { Controller } from "react-hook-form";
import { ControllerProps } from "./types";

export interface TextInputProps extends Omit<InputTextProps, "name" | "defaultValue"> {
  controller: ControllerProps;
  block?: boolean;
  defaultValue?: string;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  const { controller, block, defaultValue = "", ...rest } = props;

  return (
    <Controller
      defaultValue={controller?.defaultValue || defaultValue}
      {...controller}
      render={({ field, fieldState }) => (
        <InputText
          id={rest.id || field.name}
          {...rest}
          invalid={fieldState.invalid}
          className={classNames(rest.className, {
            "w-full": block,
          })}
          {...field}
        />
      )}
    />
  );
};

export default TextInput;
