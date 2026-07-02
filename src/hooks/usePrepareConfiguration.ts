import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEquipmentTranslations } from "./useEquipmentTranslations";
import { usePrintQueryGlass } from "./usePrintQueryGlass";
import useConstruction from "./useConstruction";
import { checkDoorFeatures, todayDate } from "../utils";

const usePrepareConfiguration = () => {
  const { i18n } = useTranslation();
  const configuration = useSelector((state: RootState) => state.configuration);
  const { translations, getTranslation } = useEquipmentTranslations();
  const glassSectionDataSerbian = usePrintQueryGlass(true);
  const glassSectionDataUserLang = usePrintQueryGlass(false);

  const { hasTransom, hasDoubleDoor, hasLeftGlass, hasRightGlass } =
    checkDoorFeatures(configuration["type"]);

  const { sumOfAllWidths, sumOfAllHeights } = useConstruction(configuration);

  const currentLang = i18n.language || "en";

  const translateValue = (value: string, translateOnSerbian: boolean) => {
    const lang = translateOnSerbian ? "sr" : currentLang;
    const translationsByLang = i18n.getDataByLanguage(lang)?.translation;

    return translationsByLang && translationsByLang[value]
      ? translationsByLang[value]
      : i18n.t(value);
  };

  const translateKeys = (
    data: Record<string, any>,
    translateOnSerbian: boolean
  ): Record<string, any> => {
    return Object.keys(data).reduce(
      (translatedData, key) => {
        const translatedKey = translateValue(key, translateOnSerbian);
        translatedData[translatedKey] = data[key];
        return translatedData;
      },
      {} as Record<string, any>
    );
  };

  const constructSections = (translateOnSerbian: boolean) => {
    const lang = translateOnSerbian ? "sr" : currentLang;

    const getTranslatedEquipmentName = (
      category: string,
      id?: number | null
    ) => (id && translations ? getTranslation(category, id, lang) : "");

    const sections = {
      yourConfiguration: {
        title: translateValue("your-configuration", translateOnSerbian),
        data: translateKeys(
          {
            "reference-number": "00000000", // TODO: Add reference number
            date: todayDate(),
            model: configuration["model-name"],
          },
          translateOnSerbian
        ),
      },
      construction: {
        title: translateValue("construction", translateOnSerbian),
        data: translateKeys(
          {
            type: translateValue(configuration.type, translateOnSerbian),
            material: translateValue(
              configuration.material ?? "",
              translateOnSerbian
            ),
            "system-profile": configuration["system-name"],
            "external-measure": `${sumOfAllWidths} x ${sumOfAllHeights} mm`,
            "door-dimensions": `${configuration["width"]} x ${configuration["height"]} mm`,
            "half-panel-width": hasDoubleDoor
              ? `${configuration["halfPanelWidth"]} mm`
              : null,
            "side-glass-left": hasLeftGlass
              ? `${configuration["leftSideWidth"]} mm`
              : null,
            "side-glass-right": hasRightGlass
              ? `${configuration["rightSideWidth"]} mm`
              : null,
            "transom-glass": hasTransom
              ? `${configuration["upperGlassHeight"]} mm`
              : null,
          },
          translateOnSerbian
        ),
      },
      color: {
        title: translateValue("color", translateOnSerbian),
        data: translateKeys(
          {
            "panel-color": configuration["panel-color-name"] || "default-color",
            "frame-color": configuration["frame-color-name"] || "default-color",
          },
          translateOnSerbian
        ),
      },
      glass: {
        title: translateValue("glass", translateOnSerbian),
        data: translateOnSerbian
          ? glassSectionDataSerbian
          : glassSectionDataUserLang,
      },
      equipment: {
        title: translateValue("equipment", translateOnSerbian),
        data: translateKeys(
          {
            handrail: getTranslatedEquipmentName(
              "handrail",
              configuration.equipment.handrail?.id
            ),
            "doorknob-inside": getTranslatedEquipmentName(
              "doorknob-inside",
              configuration.equipment.doorknobInside?.id
            ),
            rosette: getTranslatedEquipmentName(
              "rosette",
              configuration.equipment.rosette?.id
            ),
            "parapet-protection": getTranslatedEquipmentName(
              "parapet-protection",
              configuration.equipment.parapetProtection?.id
            ),
            cylinder: getTranslatedEquipmentName(
              "cylinder",
              configuration.equipment.cylinder?.id
            ),
            spy: getTranslatedEquipmentName(
              "spy",
              configuration.equipment.spy?.id
            ),
            "access-control": getTranslatedEquipmentName(
              "access-control",
              configuration.equipment.accessControl?.id
            ),
            hinges: getTranslatedEquipmentName(
              "hinges",
              configuration.equipment.hinges?.id
            ),
            lock: getTranslatedEquipmentName(
              "equipment_locks",
              configuration.equipment.lock?.id
            ),
            "automatic-closing-device": getTranslatedEquipmentName(
              "automatic-closing-device",
              configuration.equipment.automaticClosingDevice?.id
            ),
            "electromagnetic-receiver": getTranslatedEquipmentName(
              "electromagnetic-receiver",
              configuration.equipment.electromagneticReceiver?.id
            ),
            "house-numbers": getTranslatedEquipmentName(
              "house-numbers",
              configuration.equipment.houseNumbers?.id
            ),
          },
          translateOnSerbian
        ),
      },
    };

    return sections;
  };

  const sectionsSerbian = constructSections(true);
  const sectionsUserLang = constructSections(false);

  return { sectionsSerbian, sectionsUserLang };
};

export default usePrepareConfiguration;
