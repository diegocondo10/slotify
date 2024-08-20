import classNames from 'classnames';
import React from 'react';
import DatePicker, { DatePickerProps } from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { ControllerProps } from './types';

export interface TimePickerProps {
  controller: ControllerProps;
  block?: boolean;
  datePicker?: DatePickerProps;
  className?: string;
  timePeriod?: 'AM' | 'PM';
}

const TimePicker: React.FC<TimePickerProps> = (props) => {
  const { controller, block, datePicker, className, timePeriod } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <DatePicker
          locale="es"
          className={classNames('p-inputtext p-component font-semibold text-center uppercase', className, {
            'w-full': block,
            'p-invalid': fieldState.invalid,
          })}
          calendarClassName="p-input"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Horas"
          dateFormat="h:mm aa"
          timeFormat="h:mm aa"
          {...datePicker}
          selected={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
        />
      )}
    />
  );
};

export default TimePicker;
