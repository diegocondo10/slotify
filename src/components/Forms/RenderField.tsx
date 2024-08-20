/* eslint-disable no-unused-vars */
import React from 'react';
import { Controller } from 'react-hook-form';

export type RenderFieldProps = {
  name: string;
  defaultValue?: any;
  control?: any;
  render?: ({ field, fieldState, formState, value }) => React.ReactElement;
  renderIfNotValue?: ({ field, fieldState, formState, value }) => React.ReactElement;
};

const RenderField: React.FC<RenderFieldProps> = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={props.defaultValue}
      render={({ field, fieldState, formState }) => {
        if (field.value) {
          return props.render({ field, fieldState, formState, value: field.value });
        }
        if (props.renderIfNotValue) {
          return props.renderIfNotValue({ field, fieldState, formState, value: field.value });
        }
        return null;
      }}
    />
  );
};

export default RenderField;
