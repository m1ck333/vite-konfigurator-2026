import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Select from "../../../ui/Select";
import { SkeletonGrid } from "../../../ui/Skeleton";
import Error from "../../../ui/Error";
import EquipmentGrid from "./EquipmentGrid";
import EquipmentRows from "./EquipmentRows";
import Cylinders from "./Cylinders";
import SectionHeading from "../../../ui/SectionHeading";
import {
  EquipmentSelections,
  setEquipmentSelection,
} from "../../../../features/configuration/configurationSlice";
import { RootState } from "../../../../app/store";
import { setActiveDropDownItem } from "../../../../features/sidebar/sidebarSlice";
import { useEquipmentOtherCategories } from "../../../../hooks/useEquipmentOtherCategories";
import { useEquipmentOthers } from "../../../../hooks/useEquipmentOthers";
import EquipmentsWithSubcategories from "./EquipmentsWithSubcategories";

// Import items

const Equipment = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useEquipmentOtherCategories();
  const {
    equipmentOthers,
    equipmentOthersSubcategories,
    isLoading: isLoadingEquipment,
    isError: isErrorEquipment,
  } = useEquipmentOthers(true);

  const selectedDropDownItem = useSelector(
    (state: RootState) => state.sidebar.activeDropDownItem.equipment
  );

  const currentSelections = useSelector(
    (state: RootState) => state.configuration.equipment
  );

  const selectOptions = categories.map((category) => ({
    value: category.name,
    label: t(category.name),
  }));

  const handleSelectDropDownItem = (value: string | null) => {
    if (!value) return;
    dispatch(setActiveDropDownItem({ field: "equipment", value }));
  };

  const handleItemSelect = (id: number | null, category: string) => {
    dispatch(
      setEquipmentSelection({
        category: category as keyof EquipmentSelections,
        selection: { id },
      })
    );
  };

  const renderComponentBasedOnSelection = () => {
    const selectedCategory = categories.find(
      (category) => category.name === selectedDropDownItem
    );

    if (
      !selectedCategory ||
      !equipmentOthers ||
      //@ts-ignore
      !equipmentOthers[selectedCategory.name]
    ) {
      return null;
    }

    const selectedEquipments =
      //@ts-ignore
      equipmentOthers[selectedCategory.name].equipments;
    const groupedBySubcategory =
      //@ts-ignore
      equipmentOthers[selectedCategory.name]?.groupedBySubcategory;

    const categoryToSubcategoryId: Record<string, number> = {
      handrail: 1,
      accessControl: 5,
      hinges: 8,
      automaticClosingDevice: 10,
    };

    if (categoryToSubcategoryId[selectedDropDownItem]) {
      return (
        <EquipmentsWithSubcategories
          type={
            selectedDropDownItem === "handrail" ? "handrails" : "access-control"
          }
          handleItemSelect={(id) => handleItemSelect(id, selectedDropDownItem)}
          //@ts-ignore
          selectedItem={currentSelections[selectedDropDownItem].id}
          grouped={groupedBySubcategory}
          subcategories={
            equipmentOthersSubcategories?.filter(
              (subcategory) =>
                subcategory.category_id ===
                categoryToSubcategoryId[selectedDropDownItem]
            ) ?? []
          }
          showRemoveButton={[
            "accessControl",
            "automaticClosingDevice",
          ].includes(selectedDropDownItem)}
        />
      );
    }

    switch (selectedDropDownItem) {
      case "doorknobOutside":
      case "doorknobInside":
        return (
          <EquipmentRows
            items={selectedEquipments}
            selectedItem={currentSelections.doorknobInside.id}
            handleItemSelect={(id) => handleItemSelect(id, "doorknobInside")}
          />
        );

      case "cylinder":
        return (
          <Cylinders
            cylinders={selectedEquipments}
            selectedItem={currentSelections.cylinder.id}
            handleItemSelect={(id, name, imageName) =>
              handleItemSelect(id, "cylinder")
            }
          />
        );

      case "rosette":
        return (
          <EquipmentGrid
            items={selectedEquipments}
            selectedItem={currentSelections.rosette.id}
            handleItemSelect={(id, name, imageName) =>
              handleItemSelect(id, "rosette")
            }
          />
        );

      case "parapetProtection":
        return (
          <EquipmentRows
            items={selectedEquipments}
            selectedItem={currentSelections.parapetProtection.id}
            handleItemSelect={(id, name, imageName) =>
              handleItemSelect(id, "parapetProtection")
            }
            itemCanBeRemoved
          />
        );

      case "spy":
        return (
          <EquipmentRows
            items={selectedEquipments}
            selectedItem={currentSelections.spy.id}
            handleItemSelect={(id, name, imageName) =>
              handleItemSelect(id, "spy")
            }
            itemCanBeRemoved
          />
        );

      case "electromagneticReceiver":
        return (
          <EquipmentRows
            items={selectedEquipments}
            selectedItem={currentSelections.electromagneticReceiver.id}
            handleItemSelect={(id, name, imageName) =>
              handleItemSelect(id, "electromagneticReceiver")
            }
            itemCanBeRemoved
          />
        );

      case "houseNumbers":
        return (
          <EquipmentGrid
            items={selectedEquipments}
            selectedItem={currentSelections.houseNumbers.id}
            handleItemSelect={(id, name, imageName) =>
              handleItemSelect(id, "houseNumbers")
            }
            itemCanBeRemoved
          />
        );

      default:
        return null;
    }
  };
  if (isLoadingCategories || isLoadingEquipment) return <SkeletonGrid />;
  if (isErrorCategories || isErrorEquipment) return <Error />;

  return (
    <>
      <SectionHeading>{t("choose-door-equipment")}</SectionHeading>

      <Select
        options={selectOptions}
        value={selectedDropDownItem}
        onChange={(value: string | null) => handleSelectDropDownItem(value)}
        classNames="mb-2"
      />

      {renderComponentBasedOnSelection()}
    </>
  );
};

export default Equipment;
