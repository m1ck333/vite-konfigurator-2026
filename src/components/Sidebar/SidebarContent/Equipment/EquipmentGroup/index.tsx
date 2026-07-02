import React from "react";
import styles from "./EquipmentGroup.module.css";
import { EquipmentOther } from "../../../../../types";
import { useTranslation } from "react-i18next";

interface EquipmentGroupProps {
  groupName: string;
  items: EquipmentOther[];
  selectedItem: number | null;
  onRadioChange: (
    itemId: number,
    itemName: string,
    itemImgName: string
  ) => void;
  groupDescription: string;
  type: string;
  groupImg?: string;
}

const EquipmentGroup: React.FC<EquipmentGroupProps> = ({
  groupName,
  items,
  selectedItem,
  onRadioChange,
  groupDescription,
  type,
  groupImg,
}) => {
  const { i18n } = useTranslation();

  const getImageUrl = () => {
    if (groupImg) {
      return `${process.env.REACT_APP_API_URL}/${groupImg}`;
    }
    return `${process.env.REACT_APP_API_URL}/storage/thumbnails/equipment/${type}/${groupName}.png`;
  };

  const getTranslation = (
    item: EquipmentOther,
    key: "name" | "description"
  ) => {
    return (
      item.translations.find((t) => t.language === i18n.language)?.[key] || ""
    );
  };

  const renderRadioButton = (item: EquipmentOther) => {
    const itemName = getTranslation(item, "name");
    const itemDescription = getTranslation(item, "description");
    const isSelected = selectedItem === item.id;

    return (
      <div
        key={item.id}
        className={`mb-2 p-2.5 rounded-lg text-sm border transition-all ${
          isSelected
            ? "border-primary-green bg-primary-green/5 shadow-[0_6px_16px_-8px_rgba(5,130,116,0.5)]"
            : "bg-white border-primary-grey-lightest hover:border-primary-green-light"
        }`}
      >
        <input
          id={`radio-${item.id}`}
          className={styles.radioInput}
          type="radio"
          name="equipment"
          checked={selectedItem === item.id}
          onClick={() =>
            onRadioChange(item.id, itemDescription || itemName, item.code)
          }
          readOnly
        />
        <label htmlFor={`radio-${item.id}`} className={styles.radioLabel}>
          <div className="w-5">
            <span className={styles.radioCustom} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm">{itemName}</p>
            {itemDescription && (
              <p className="text-xs italic">({itemDescription})</p>
            )}
          </div>
        </label>
      </div>
    );
  };

  return (
    <div className="flex w-full gap-3">
      <div className="w-2/5 flex items-center">
        <img src={getImageUrl()} alt={groupName} />
      </div>

      <div className="w-3/5 flex flex-col justify-between text-black">
        <div>{items?.map(renderRadioButton)}</div>
        <p className="text-xs">{groupDescription}</p>
      </div>
    </div>
  );
};

export default EquipmentGroup;
