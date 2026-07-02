import React from "react";

import styles from "./Construction.module.css";

interface InputWithButtonsProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
}

const InputWithButtons: React.FC<InputWithButtonsProps> = ({
  label,
  value,
  onChange,
  min,
  max,
}) => {
  const handleInputChange = (newValue: number) => {
    if (newValue < min) {
      onChange(min);
    } else if (newValue > max) {
      onChange(max);
    } else {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    handleInputChange(value - 1);
  };

  const handleIncrement = () => {
    handleInputChange(value + 1);
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-primary-grey-dark">
        {label}:
      </span>

      <div className="relative flex items-center">
        <button
          type="button"
          id="decrement-button"
          data-input-counter-decrement="quantity-input"
          onClick={handleDecrement}
          className="flex items-center justify-center w-9 h-9 bg-white border border-primary-grey-lightest rounded-l-lg text-primary-grey-dark hover:bg-primary-grey-lightest hover:text-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/30 transition-colors"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        </button>

        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className={`${styles.inputTypeNumber} w-14 h-9 text-center text-sm font-semibold text-primary-green-dark bg-white border-y border-primary-grey-lightest focus:outline-none focus:border-primary-green block`}
          min={min}
          max={max}
        />

        <button
          type="button"
          id="increment-button"
          data-input-counter-increment="quantity-input"
          onClick={handleIncrement}
          className="flex items-center justify-center w-9 h-9 bg-white border border-primary-grey-lightest rounded-r-lg text-primary-grey-dark hover:bg-primary-grey-lightest hover:text-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/30 transition-colors"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputWithButtons;
