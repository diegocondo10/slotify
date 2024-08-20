import classNames from 'classnames';
import { Calendar, CalendarProps } from 'primereact/calendar';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface DateInputProps extends Omit<CalendarProps, 'name' | 'defaultValue'> {
  controller: ControllerProps;
  block?: boolean;
}

const DateInput: React.FC<DateInputProps> = (props) => {
  const { controller, ...rest } = props;
  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <Calendar
          id={field.name}
          {...rest}
          locale="es"
          dateFormat="dd/mm/yy"
          className={classNames(rest.className, { 'w-full': props.block })}
          invalid={fieldState.invalid}
          name={field.name}
          inputRef={field.ref}
          placeholder="DD/MM/yyyy"
          monthNavigator
          yearNavigator
          yearRange="1930:2030"
          onChange={field.onChange}
          value={field.value}
          onBlur={field.onBlur}
        />
      )}
    />
  );
};

export default DateInput;
