import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseInputStyles =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  label,
  htmlFor,
  required,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

type TextFieldProps = Omit<FieldWrapperProps, "children"> &
  InputHTMLAttributes<HTMLInputElement>;

export function TextField({
  label,
  htmlFor,
  required,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      required={required}
      className={className}
    >
      <input id={htmlFor} className={baseInputStyles} {...inputProps} />
    </FieldWrapper>
  );
}

type TextAreaFieldProps = Omit<FieldWrapperProps, "children"> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({
  label,
  htmlFor,
  required,
  className,
  rows = 4,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      required={required}
      className={className}
    >
      <textarea
        id={htmlFor}
        rows={rows}
        className={`${baseInputStyles} resize-y`}
        {...textareaProps}
      />
    </FieldWrapper>
  );
}
