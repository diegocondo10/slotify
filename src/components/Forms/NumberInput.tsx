import classNames from 'classnames';
import { InputNumber, InputNumberProps } from 'primereact/inputnumber';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface NumberInputProps extends Omit<InputNumberProps, 'name' | 'defaultValue'> {
  controller: ControllerProps;
  block?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const { controller, block, ...rest } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => {
        return (
          <InputNumber
            // id={field.name}
            {...rest}
            className={classNames(rest.className, { 'w-full': block })}
            inputClassName={classNames(rest.inputClassName, { 'w-full': block })}
            name={field.name}
            value={field.value}
            invalid={fieldState.invalid}
            onValueChange={(e) => {
              field.onChange(e.value);
            }}
            inputId={field.name}
          />
        );
      }}
    />
  );
};

export default NumberInput;
