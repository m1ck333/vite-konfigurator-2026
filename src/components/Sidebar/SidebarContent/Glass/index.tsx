import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";

import Select from "../../../ui/Select";
import GlassGrid from "./GlassGrid";
import Selectable from "../../../ui/Selectable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { setActiveDropDownItem } from "../../../../features/sidebar/sidebarSlice";
import SectionHeading from "../../../ui/SectionHeading";
import useEquipmentGlasses from "../../../../hooks/useEquipmentGlasses";

interface SelectOption {
  value: string;
  label: string;
}

const Glass = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let chosenSelect = useSelector(
    (state: RootState) => state.sidebar.activeDropDownItem.glass
  );

  const {
    ornamentGlasses,
    decorativeSideGlasses,
    hasTransom,
    hasSideGlass,
    decorativeInnerGlassForModal,
    selectedDoorModel,
    hasInDoorGlass,
    selectedGlasses,
    dispatchSelectedGlass,
  } = useEquipmentGlasses();
  const selectOptions: SelectOption[] = [
    hasSideGlass ? { value: "sideglasses", label: t("side-glasses") } : null,
    hasTransom ? { value: "skylight", label: t("skylight") } : null,
    hasInDoorGlass ? { value: "doorglass", label: t("door-glass") } : null,
  ].filter(Boolean) as SelectOption[];

  const handleSelectGlass = (id: number | null, name: string) => {
    const sliceField =
      chosenSelect === "doorglass"
        ? "inner-glass-name"
        : chosenSelect === "sideglasses"
          ? "side-glass-name"
          : "transom-glass-name";

    dispatchSelectedGlass(sliceField, id, name);
  };

  if (
    !chosenSelect ||
    (chosenSelect === "sideglasses" && !hasSideGlass) ||
    (chosenSelect === "skylight" && !hasTransom)
  ) {
    chosenSelect = "doorglass";
  }

  const handleSelectChange = (value: string | null) => {
    if (!value) return;
    dispatch(setActiveDropDownItem({ field: "glass", value }));
  };
  return selectOptions && selectOptions.length > 0 ? (
    <>
      <SectionHeading>{t("choose-door-glass")}</SectionHeading>

      <Select
        options={selectOptions}
        value={chosenSelect}
        onChange={handleSelectChange}
        classNames="mb-6"
      />

      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary-grey">
        {t("ornament-glass")}
      </p>

      <GlassGrid
        items={ornamentGlasses}
        onSelect={(id, name) => handleSelectGlass(id, name)}
        selectedGlasses={selectedGlasses}
        chosenSelect={chosenSelect}
      />

      {chosenSelect === "doorglass" && decorativeInnerGlassForModal && (
        <>
          <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-primary-grey">
            {t("decorative-glass")}
          </p>

          <div className="text-center cursor-pointer w-32">
            <Selectable
              isSelected={!selectedGlasses.inner}
              onClick={() => handleSelectGlass(null, "default")}
            >
              <img
                src={decorativeInnerGlassForModal}
                alt={selectedDoorModel || t("default-door-model")}
                className="w-full rounded-lg border border-primary-grey-lightest"
              />
              <p className="mt-2 text-xs font-medium text-primary-grey-dark">{`${t("glass")} ${selectedDoorModel || t("default-door-model")}`}</p>
            </Selectable>
          </div>
        </>
      )}

      {chosenSelect === "sideglasses" && decorativeSideGlasses && (
        <>
          <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-primary-grey">
            {t("side-glass")}
          </p>

          <GlassGrid
            items={decorativeSideGlasses}
            onSelect={(id, name) => handleSelectGlass(id, name)}
            selectedGlasses={selectedGlasses}
            chosenSelect={chosenSelect}
          />
        </>
      )}
    </>
  ) : (
    <div className="flex flex-col items-center justify-center text-center py-16 text-primary-grey">
      <FontAwesomeIcon icon={faLayerGroup} className="text-4xl mb-3 opacity-40" />
      <p className="text-sm">{t("no-glass-for-this-model")}</p>
    </div>
  );
};

export default Glass;
