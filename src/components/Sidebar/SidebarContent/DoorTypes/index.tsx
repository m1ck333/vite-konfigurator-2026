import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Selectable from "../../../ui/Selectable";
import { RootState } from "../../../../app/store";
import { setConfigurationField } from "../../../../features/configuration/configurationSlice";
import doorTypes from "./DoorTypesItems";
import { resetActiveDropDownItemGlass } from "../../../../features/sidebar/sidebarSlice";
import SectionHeading from "../../../ui/SectionHeading";

const DoorTypes = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentDoorType = useSelector(
    (state: RootState) => state.configuration.type
  );

  const handleSelectType = (typeText: string) => {
    dispatch(setConfigurationField({ field: "type", value: typeText }));
    dispatch(resetActiveDropDownItemGlass());
  };

  return (
    <>
      <SectionHeading>{t("choose-door-type")}</SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doorTypes.map((doorType, index) => {
          const isSelected = currentDoorType === doorType.text;

          return (
            <Selectable
              key={index}
              isSelected={isSelected}
              onClick={() => handleSelectType(doorType.text)}
            >
              <img
                src={doorType.icon}
                alt={t(doorType.text)}
                className="h-24 w-auto object-contain"
              />
              <span className="mt-2.5 text-center text-[13px] font-medium leading-tight">
                {t(doorType.text)}
              </span>
            </Selectable>
          );
        })}
      </div>
    </>
  );
};

export default DoorTypes;
