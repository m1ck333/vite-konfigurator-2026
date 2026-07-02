import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import RightInsideImg from "../../../../assets/images/opening-standards/right-inside.png";
import RightOutsideImg from "../../../../assets/images/opening-standards/right-outside.png";
import LeftInsideImg from "../../../../assets/images/opening-standards/left-inside.png";
import LeftOutsideImg from "../../../../assets/images/opening-standards/left-outside.png";

import { RootState } from "../../../../app/store";
import InputWithButtons from "./InputWithButtons";
import RangeSlider from "./RangeSlider";
import Select from "../../../ui/Select";
import useConstruction from "../../../../hooks/useConstruction";
import SideGlassSelector from "./SideGlassSelector";
import { setConfigurationField } from "../../../../features/configuration/configurationSlice";
import SectionHeading from "../../../ui/SectionHeading";

const Construction: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const doorConfiguration = useSelector(
    (state: RootState) => state.configuration
  );

  const openingStandard = doorConfiguration["DIN-opening-standard"];

  const setOpeningStandard = (standard: string | null) =>
    dispatch(
      setConfigurationField({
        field: "DIN-opening-standard",
        value: standard,
      })
    );

  const {
    dimensions,
    dimensionConfigs,
    numberOfRightSideGlasses,
    numberOfLeftSideGlasses,
    handleNumberOfGlassesChange,
    handleDimensionChange,
    sumOfAllWidths,
    sumOfAllHeights,
  } = useConstruction(doorConfiguration);

  const openingStandardsOptions = [
    { value: "right-inside", label: `${t("right")} - ${t("inside")}` },
    { value: "right-outside", label: `${t("right")} - ${t("outside")}` },
    { value: "left-inside", label: `${t("left")} - ${t("inside")}` },
    { value: "left-outside", label: `${t("left")} - ${t("outside")}` },
  ];

  const openingStandardImages: Record<string, string> = {
    "right-inside": RightInsideImg,
    "right-outside": RightOutsideImg,
    "left-inside": LeftInsideImg,
    "left-outside": LeftOutsideImg,
  };

  return (
    <>
      <SectionHeading>{t("choose-dimension")}</SectionHeading>

      {dimensionConfigs.map(({ key, label, min, max }) => (
        <React.Fragment key={key}>
          <InputWithButtons
            label={label}
            value={dimensions[key]}
            onChange={(newValue) => handleDimensionChange(key, newValue)}
            min={min}
            max={max}
          />

          <RangeSlider
            value={dimensions[key]}
            onChange={(newValue) => handleDimensionChange(key, newValue)}
            min={min}
            max={max}
          />
        </React.Fragment>
      ))}

      <div className="mb-8 pt-4 border-t border-primary-grey-lightest flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-primary-grey-dark">
          {t("external-measure")}:
        </span>

        <div className="text-sm font-bold text-primary-green-dark">
          {sumOfAllWidths} X {sumOfAllHeights}
        </div>
      </div>

      <SideGlassSelector
        doorType={doorConfiguration.type}
        numberOfGlasses={{
          left: numberOfLeftSideGlasses,
          right: numberOfRightSideGlasses,
        }}
        onNumberOfGlassesChange={handleNumberOfGlassesChange}
      />

      <div className="mb-8 flex flex-wrap flex-col gap-2">
        <span className="text-sm font-medium text-primary-grey-dark">
          {t("DIN-opening-standard")}:
        </span>

        <Select
          options={openingStandardsOptions}
          value={openingStandard || "left-inside"}
          onChange={(value) => setOpeningStandard(value)}
        />
      </div>

      <div className="flex justify-center">
        <div className="rounded-xl border border-primary-grey-lightest bg-white p-3 shadow-soft">
          <img
            src={openingStandardImages[openingStandard || "left-inside"]}
            alt={openingStandard || "left-inside"}
            className="max-h-48 object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default Construction;
