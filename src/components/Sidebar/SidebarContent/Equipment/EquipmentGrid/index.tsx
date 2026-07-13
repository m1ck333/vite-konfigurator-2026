import React from "react";

import styles from "./EquipmentGrid.module.css";
import Selectable from "../../../../ui/Selectable";
import { EquipmentOther } from "../../../../../types";
import RemoveItem from "../../../../ui/RemoveItem";
import { useTranslation } from "react-i18next";

interface EquipmentGridProps {
  items: EquipmentOther[];
  selectedItem: number | null;
  handleItemSelect: (
    id: number | null,
    name: string | null,
    imageName: string | null
  ) => void;
  itemCanBeRemoved?: boolean;
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({
  items,
  selectedItem,
  handleItemSelect,
  itemCanBeRemoved = false,
}) => {
  const { i18n } = useTranslation();

  const renderItem = (item: EquipmentOther) => (
    <Selectable
      isSelected={selectedItem === item.id}
      onClick={() => handleItemSelect(item.id, item.code, item.code)}
      classNames="h-40 justify-center"
    >
      <img
        className={styles.imageStyle}
        src={`${process.env.REACT_APP_API_URL}/${
          typeof item.thumbnail === "string" &&
          item.thumbnail.includes("storage")
            ? item.thumbnail
            : `storage/${item.thumbnail}`
        }`}
        alt={item.code}
      />

      {item.code && (
        <p className={styles.textStyle}>
          {
            item.translations.find(
              (translation) => translation.language === i18n.language
            )?.name
          }
        </p>
      )}
    </Selectable>
  );

  return (
    <div className="flex flex-col">
      <div className="h-6">
        <RemoveItem
          isShowed={selectedItem !== null && itemCanBeRemoved}
          onClick={() => handleItemSelect(null, null, null)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default EquipmentGrid;
