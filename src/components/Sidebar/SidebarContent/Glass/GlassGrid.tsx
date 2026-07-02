import React from "react";
import Selectable from "../../../ui/Selectable";

type GlassGridProps = {
  items: Array<{ name: string; img: string; id: number }>;
  onSelect: (id: number, name: string) => void;
  selectedGlasses: {
    side: number | null;
    transom: number | null;
    inner: number | null;
  };
  chosenSelect: string;
};

const GlassGrid: React.FC<GlassGridProps> = ({
  items,
  onSelect,
  selectedGlasses,
  chosenSelect,
}) => {
  let selectedValue: number | null = 0;
  if (chosenSelect === "doorglass") {
    selectedValue = selectedGlasses.inner;
  } else if (chosenSelect === "sideglasses") {
    selectedValue = selectedGlasses.side;
  } else if (chosenSelect === "skylight") {
    selectedValue = selectedGlasses.transom;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((item) => (
        <Selectable
          key={item.name}
          classNames="text-center cursor-pointer"
          onClick={() => onSelect(item.id, item.name)}
          isSelected={selectedValue === item.id}
        >
          <img
            src={item.img}
            alt={item.name}
            className="h-40 md:h-28 rounded-lg border border-primary-grey-lightest"
          />

          <p className="w-full text-center break-words overflow-hidden max-h-12 mt-2 text-xs font-medium text-primary-grey-dark">
            {item.name}
          </p>
        </Selectable>
      ))}
    </div>
  );
};

export default GlassGrid;
