import { FC } from "react";
import ErrorMessage from "./ErrorMessage";

export interface FormFieldRenderProps {
  name: string;
  label: string | React.ReactElement;
  labelProps?: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >;
  render: ({ name }: { name: string }) => React.ReactElement;
}

const FormFieldRender: FC<FormFieldRenderProps> = ({ name, render, label }) => {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      {render({ name })}
      <ErrorMessage name={name} />
    </>
  );
};

export default FormFieldRender;
