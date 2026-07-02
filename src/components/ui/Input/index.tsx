import React, {
  HTMLInputTypeAttribute,
  ChangeEventHandler,
  KeyboardEventHandler,
} from "react";

interface InputProps {
  label?: string;
  type: HTMLInputTypeAttribute;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  name,
  required,
  placeholder,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1.5 text-sm font-medium text-primary-grey-dark"
        >
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        placeholder={required && placeholder ? `${placeholder} *` : placeholder}
        className={`bg-white border text-primary-grey-dark text-sm rounded-lg block w-full p-2.5 outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary-green/30 focus:border-primary-green ${
          error ? "border-danger" : "border-primary-grey-lightest"
        }`}
        {...rest}
      />
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
