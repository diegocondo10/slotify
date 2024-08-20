import { Checkbox } from 'primereact/checkbox';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface ToggleProps extends ControllerProps {
  on?: string | any;
  off?: string | any;
  size?: 'sm' | 'lg' | 'md';
  offstyle?: 'primary' | 'secondary' | 'dark';
  onstyle?: 'primary' | 'secondary' | 'dark';
  onClick?: any;
  active?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ name, rules, defaultValue, on = 'SI', off = 'NO', size }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div className="flex align-items-center gap-2">
          <Checkbox
            inputId={name}
            checked={field.value}
            onChange={(e) => {
              field.onChange(e.checked);
            }}
          />
          {field?.value && (
            <label className="text-base text-blue-800" htmlFor={name}>
              {on}
            </label>
          )}
          {!field?.value && (
            <label className="text-base text-blue-800" htmlFor={name}>
              {off}
            </label>
          )}
        </div>
      )}
    />
  );
};

export default Toggle;
