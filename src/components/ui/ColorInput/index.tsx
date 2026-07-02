import React, { ChangeEventHandler } from "react";

interface ColorInputProps {
  label?: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
  error?: string;
  required?: boolean;
}

const ColorInput: React.FC<ColorInputProps> = ({
  label,
  name,
  onChange,
  value,
  error,
  required,
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
        type="color"
        className={`bg-white border text-sm rounded-lg block cursor-pointer p-0.5 h-10 w-16 outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary-green/30 focus:border-primary-green ${
          error ? "border-danger" : "border-primary-grey-lightest"
        }`}
        onChange={onChange}
        value={value}
      />

      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ColorInput;
