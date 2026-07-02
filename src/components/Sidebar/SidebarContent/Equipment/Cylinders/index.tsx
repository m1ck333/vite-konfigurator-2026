import React from "react";
import { Equipment } from "../../../../../types";
import Selectable from "../../../../ui/Selectable";

interface CylindersProps {
  cylinders: Equipment[];
  selectedItem: number | null;
  handleItemSelect: (
    id: number | null,
    name: string | null,
    imageName: string | null
  ) => void;
}

const Cylinders = ({
  cylinders,
  selectedItem,
  handleItemSelect,
}: CylindersProps) => {
  const renderItem = (item: Equipment) => (
    <Selectable
      isSelected={selectedItem === item.id}
      onClick={() => handleItemSelect(item.id, item.name, item.equipment_code)}
    >
      <img
        src={`${process.env.REACT_APP_API_URL}/${item.thumbnail}`}
        alt={item.equipment_code}
        className="h-24 w-auto object-contain"
      />

      <p className="mt-2 text-xs font-medium text-center">{item.name}</p>
    </Selectable>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8">
      {cylinders.map((cylinder, index) => (
        <React.Fragment key={index}>{renderItem(cylinder)}</React.Fragment>
      ))}
    </div>
  );
};

export default Cylinders;
