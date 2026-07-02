import React from "react";
import { useTranslation } from "react-i18next";

import Select from "../../../ui/Select";

const SELECT_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
];

type SideGlassSelectorProps = {
  doorType: string;
  numberOfGlasses: {
    left: number;
    right: number;
  };
  onNumberOfGlassesChange: (side: "left" | "right", value: number) => void;
};

const SideGlassSelector: React.FC<SideGlassSelectorProps> = ({
  doorType,
  numberOfGlasses,
  onNumberOfGlassesChange,
}) => {
  const { t } = useTranslation();

  const renderSideSelector = (side: "left" | "right") => (
    <div className="flex justify-between items-center gap-3 mb-8">
      <span className="text-sm font-medium text-primary-grey-dark">
        {t(`${side}-side-glass-number`)}
      </span>

      <Select
        options={SELECT_OPTIONS}
        value={numberOfGlasses[side].toString()}
        onChange={(value) => {
          if (!value) return;
          onNumberOfGlassesChange(side, parseInt(value));
        }}
        classNames="w-24 shrink-0"
      />
    </div>
  );

  return (
    <div className="flex flex-col">
      {(doorType.includes("left") || doorType.includes("both")) &&
        renderSideSelector("left")}
      {(doorType.includes("right") || doorType.includes("both")) &&
        renderSideSelector("right")}
    </div>
  );
};

export default SideGlassSelector;
