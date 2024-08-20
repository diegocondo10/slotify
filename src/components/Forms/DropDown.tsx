import classNames from 'classnames';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface DropDownProps extends Omit<DropdownProps, 'name' | 'defaultValue'> {
  controller: ControllerProps;
  block?: boolean;
}

const DropDown: React.FC<DropDownProps> = (props) => {
  const { controller, block, ...rest } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <React.Fragment>
          <Dropdown
            id={field.name}
            className={classNames(rest.className, { 'w-full': block })}
            invalid={fieldState.invalid}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            placeholder="SELECCIONAR"
            emptyMessage="Sin resultados"
            emptyFilterMessage="Sin resultados"
            focusInputRef={field.ref}
            {...rest}
          />
        </React.Fragment>
      )}
    />
  );
};

export default DropDown;
