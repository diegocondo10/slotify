import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import React, { forwardRef } from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";
import { Controller } from "react-hook-form";
import { ControllerProps } from "./types";

export interface TimePickerProps {
  controller: ControllerProps;
  block?: boolean;
  datePicker?: DatePickerProps;
  className?: string;
  timePeriod?: "AM" | "PM";
}

const TimeInput = forwardRef<any, any>(({ value, onClick, className, disabled, ...rest }, ref) => (
  <InputText
    role='button'
    value={value}
    onClick={onClick}
    {...rest}
    className={classNames("cursor-pointer", className)}
    ref={ref}
    readOnly
    disabled={disabled}
  />
));

TimeInput.displayName = "TimeInput";

const TimePicker: React.FC<TimePickerProps> = (props) => {
  const { controller, block, datePicker, className } = props;

  return (
    <Controller
      {...controller}
      render={({ field, fieldState }) => (
        <DatePicker
          locale='es'
          className={classNames(
            "p-inputtext p-component font-semibold text-center uppercase",
            className,
            {
              "w-full": block,
              "p-invalid": fieldState.invalid,
            }
          )}
          calendarClassName='p-input w-full'
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption='Horas'
          dateFormat='h:mm aa'
          timeFormat='h:mm aa'
          {...datePicker}
          selected={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          wrapperClassName={classNames(datePicker?.wrapperClassName, {
            "w-full": block,
          })}
          customInput={<TimeInput />}
          // ref={field.ref}
        />
      )}
    />
  );
};

export default TimePicker;
