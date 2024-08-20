import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface HiddenFieldProps extends ControllerProps {
  hidden?: boolean;
}
const HiddenField: React.FC<HiddenFieldProps> = (props) => {
  const { hidden = true, ...rest } = props;
  return (
    <Controller
      name={rest.name}
      defaultValue={rest.defaultValue}
      shouldUnregister={rest.shouldUnregister}
      rules={rest.rules}
      render={({ field }) => <small style={{ display: 'none' }}>{JSON.stringify(field.value)}</small>}
    />
  );
};

export default HiddenField;
