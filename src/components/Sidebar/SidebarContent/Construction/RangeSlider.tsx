import React from "react";

import styles from "./Construction.module.css";

interface RangeSliderProps {
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  onChange,
  min,
  max,
}) => {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className={styles.slider}
      style={{
        background: `linear-gradient(to right, #058274 0%, #058274 ${pct}%, #e8e6e6 ${pct}%, #e8e6e6 100%)`,
      }}
    />
  );
};

export default RangeSlider;
