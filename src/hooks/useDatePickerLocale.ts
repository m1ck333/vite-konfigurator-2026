import { useTranslation } from "react-i18next";
import { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";
import { sr } from "date-fns/locale/sr";

registerLocale("en", enUS);
registerLocale("sr", sr);

const useDatePickerLocale = () => {
  const { i18n } = useTranslation();

  const getCurrentLocale = () => {
    switch (i18n.language) {
      case "sr":
        return "sr";
      case "en":
      default:
        return "en";
    }
  };

  return getCurrentLocale();
};

export default useDatePickerLocale;
