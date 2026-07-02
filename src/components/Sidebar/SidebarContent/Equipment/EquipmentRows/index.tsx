import React from "react";

import styles from "./EquipmentRows.module.css";
import { EquipmentOther } from "../../../../../types";
import Selectable from "../../../../ui/Selectable";
import RemoveItem from "../../../../ui/RemoveItem";
import { findItemTranslations } from "../../../../../utils";

interface EquipmentRowsProps {
  items: EquipmentOther[];
  selectedItem: number | null;
  handleItemSelect: (
    id: number | null,
    name: string | null,
    imageName: string | null
  ) => void;
  itemCanBeRemoved?: boolean;
}

const EquipmentRows: React.FC<EquipmentRowsProps> = ({
  items,
  selectedItem,
  handleItemSelect,
  itemCanBeRemoved = false,
}) => {
  const renderItem = (item: EquipmentOther) => {
    const thumbnail =
      typeof item.thumbnail === "string" && item.thumbnail.includes("storage")
        ? item.thumbnail
        : `storage/${item.thumbnail}`;

    return (
      <Selectable
        isSelected={selectedItem === item.id}
        onClick={() => handleItemSelect(item.id, item.code, item.code)}
      >
        <img
          className={styles.imageStyle}
          src={`${process.env.REACT_APP_API_URL}/${thumbnail}`}
          alt={item.code}
        />

        <p className={styles.textStyle}>
          {findItemTranslations(item.translations).name}
          <br />
          {findItemTranslations(item.translations).description}
        </p>
      </Selectable>
    );
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <RemoveItem
        isShowed={selectedItem !== null && itemCanBeRemoved}
        onClick={() => handleItemSelect(null, null, null)}
      />

      {items.map((item, index) => (
        <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  );
};

export default EquipmentRows;
