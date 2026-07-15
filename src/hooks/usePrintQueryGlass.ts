import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "../app/store";
import { checkDoorFeatures } from "../utils";

type GlassSectionData = Record<string, string>;

export const usePrintQueryGlass = (translateOnSerbian: boolean) => {
  const { i18n } = useTranslation();
  const configuration = useSelector((state: RootState) => state.configuration);
  const { hasSideGlass, hasTransom } = checkDoorFeatures(configuration.type);

  const lang = translateOnSerbian ? "sr" : i18n.language || "en";
  const translate = (key: string) => {
    const translationsByLang = i18n.getDataByLanguage(lang)?.translation;
    return translationsByLang && translationsByLang[key]
      ? translationsByLang[key]
      : i18n.t(key);
  };

  let glassSectionData: GlassSectionData = {};

  // Handle inner glass
  if (configuration["inner-glass-name"] !== null) {
    const translatedKey = translate("door-glass");

    if (configuration["inner-glass-name"] && configuration["inner-glass-name"].toLowerCase() !== "default") {
      if (configuration["inner-glass-id"] === 0) {
        glassSectionData[translatedKey] = configuration["model-name"] || "";
      } else {
        glassSectionData[translatedKey] = configuration["inner-glass-name"];
      }
    } else {
      glassSectionData[translatedKey] = translate("default-inner-glass");
    }
  }

  // Handle side glass
  if (hasSideGlass) {
    const translatedKey = translate("side-glasses");

    if (configuration["side-glass-name"] && configuration["side-glass-name"].toLowerCase() !== "default") {
      glassSectionData[translatedKey] = configuration["side-glass-name"];
    } else {
      glassSectionData[translatedKey] = translate("default-side-glass");
    }
  }

  // Handle transom glass
  if (hasTransom) {
    const translatedKey = translate("transom-glass");

    if (configuration["transom-glass-name"] && configuration["transom-glass-name"].toLowerCase() !== "default") {
      // Special case for decorative glass from the door model
      if (configuration["transom-glass-id"] === 0) {
        glassSectionData[translatedKey] = configuration["model-name"] || "";
      } else {
        glassSectionData[translatedKey] = configuration["transom-glass-name"];
      }
    } else {
      glassSectionData[translatedKey] = translate("default-transom-glass");
    }
  }

  return glassSectionData;
};
