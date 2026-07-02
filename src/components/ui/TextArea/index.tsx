import React, { ChangeEventHandler } from "react";

interface TextAreaProps {
  label?: string;
  name: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  cols?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  rows = 4,
  cols,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1.5 text-sm font-medium text-primary-grey-dark"
        >
          {label} {rest.required && <span className="text-danger">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        cols={cols}
        className="bg-white border border-primary-grey-lightest text-primary-grey-dark text-sm rounded-lg block w-full p-2.5 outline-none resize-y transition-colors focus:border-primary-green focus:ring-2 focus:ring-inset focus:ring-primary-green/30"
        placeholder={rest.placeholder ?? ""}
        required={rest.required ?? false}
        {...rest}
      ></textarea>
    </div>
  );
};

export default TextArea;
