import React from "react";
import { EquipmentOther } from "../../../../../types";
import EquipmentGroup from "../EquipmentGroup";
import RemoveItem from "../../../../ui/RemoveItem";
import { findItemTranslations } from "../../../../../utils";

interface EquipmentsWithSubcategoriesProps {
  type: "access-control" | "hinges" | "handrails";
  handleItemSelect: (id: number | null) => void;
  selectedItem: number | null;
  grouped: {
    [key: string]: EquipmentOther[];
  };
  subcategories: EquipmentOther[];
  showRemoveButton?: boolean;
  className?: string;
}

const EquipmentsWithSubcategories = ({
  type,
  handleItemSelect,
  selectedItem,
  grouped,
  subcategories,
  showRemoveButton = false,
  className = "",
}: EquipmentsWithSubcategoriesProps) => {
  return (
    <div className={className}>
      {showRemoveButton && (
        <div className="h-6">
          <RemoveItem
            isShowed={selectedItem !== null}
            onClick={() => handleItemSelect(null)}
          />
        </div>
      )}

      {subcategories.map((subcategory) => (
        <React.Fragment key={subcategory.id}>
          <hr className="mb-4 border-t" />
          <EquipmentGroup
            type={type}
            groupImg={
              typeof subcategory.thumbnail === "string"
                ? subcategory.thumbnail
                : undefined
            }
            groupName={subcategory.code}
            items={grouped[subcategory.code]}
            selectedItem={selectedItem}
            onRadioChange={handleItemSelect}
            groupDescription={
              findItemTranslations(subcategory.translations).description
            }
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default EquipmentsWithSubcategories;
