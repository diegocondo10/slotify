import React from "react";
import DatePicker from "react-datepicker";

interface DateRangeProps {
  startDate: Date;
  endDate: Date;
  onChange?: (
    date: [Date | null, Date | null],
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => void;
}

const DateRange: React.FC<DateRangeProps> = ({ startDate, endDate, onChange }) => {
  return (
    <DatePicker
      wrapperClassName='w-full'
      className='w-full p-inputtext p-component font-semibold text-center uppercase'
      selectsRange
      dateFormat='dd/MMM/yyyy'
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
    />
  );
};

export default DateRange;
