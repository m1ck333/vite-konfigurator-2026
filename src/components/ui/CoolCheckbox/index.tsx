import React, { FC } from "react";
import styles from "./CoolCheckbox.module.css";

interface CoolCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const CoolCheckbox: FC<CoolCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
}) => {
  return (
    <div className={styles["checkbox-wrapper-5"]}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1.5 text-sm font-medium text-primary-grey-dark"
        >
          {label}
        </label>
      )}

      <div className={styles["check"]}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id}></label>
      </div>
    </div>
  );
};

export default CoolCheckbox;
