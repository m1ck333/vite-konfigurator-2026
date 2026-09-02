import React, {
  HTMLInputTypeAttribute,
  ChangeEventHandler,
  KeyboardEventHandler,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
  disabled?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  name,
  required,
  placeholder,
  type,
  ...rest
}) => {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);
  const effectiveType = isPassword && show ? "text" : type;

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

      <div className="relative">
        <input
          id={name}
          name={name}
          type={effectiveType}
          placeholder={required && placeholder ? `${placeholder} *` : placeholder}
          className={`bg-white border text-primary-grey-dark text-sm rounded-lg block w-full p-2.5 outline-none transition-colors focus:ring-2 focus:ring-inset focus:ring-primary-green/30 focus:border-primary-green ${
            isPassword ? "pr-10" : ""
          } ${error ? "border-danger" : "border-primary-grey-lightest"}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            aria-label={show ? "Sakrij lozinku" : "Prikaži lozinku"}
            title={show ? "Sakrij lozinku" : "Prikaži lozinku"}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-grey hover:text-primary-grey-dark"
          >
            <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
