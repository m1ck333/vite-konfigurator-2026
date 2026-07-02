import React, { FC, ChangeEvent, InputHTMLAttributes } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  scale?: "small" | "medium" | "large";
}

const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  scale = "medium",
  ...props
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const sizeClasses = {
    small: "h-3 w-4",
    medium: "h-4 w-5",
    large: "h-5 w-6",
  };

  return (
    <label className="flex items-center space-x-3">
      <input
        type="checkbox"
        className={`form-checkbox ${sizeClasses[scale]} text-primary-green border-primary-grey-lightest rounded focus:ring-primary-green transition duration-150 ease-in-out`}
        checked={checked}
        onChange={handleChange}
        {...props}
      />

      <span className={`${props.disabled ? "text-primary-grey" : ""}`}>
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
