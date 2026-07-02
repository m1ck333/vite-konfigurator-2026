import { useTranslation } from "react-i18next";
import srFlag from "../../../assets/images/country-flags/sr-flag.png";
import enFlag from "../../../assets/images/country-flags/en-flag.png";
import Dropdown, { DropdownItem } from "../../ui/Dropdown";

const NavbarLang = () => {
  const { i18n } = useTranslation();

  const currentLang = i18n.resolvedLanguage || i18n.language || "en";
  const currentFlag = currentLang.startsWith("sr") ? srFlag : enFlag;

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const languageItems: DropdownItem[] = [
    {
      key: "en",
      label: (
        <div className="flex items-center w-max">
          <span className="text-md">En</span>
          <span className="ml-2">
            <img src={enFlag} className="w-5 h-5" alt="English flag" />
          </span>
        </div>
      ),
      action: () => changeLanguage("en"),
    },
    {
      key: "sr",
      label: (
        <div className="flex items-center">
          <span className="text-md">Sr</span>
          <span className="ml-2">
            <img src={srFlag} className="w-5 h-5" alt="Serbian flag" />
          </span>
        </div>
      ),
      action: () => changeLanguage("sr"),
    },
  ];

  return (
    <Dropdown
      trigger={
        <span className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-transform hover:scale-105">
          <img
            src={currentFlag}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-black/10"
            alt={`${currentLang} flag`}
          />
        </span>
      }
      items={languageItems}
      position="left"
    />
  );
};

export default NavbarLang;
