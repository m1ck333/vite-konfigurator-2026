import { useTranslation } from "react-i18next";
import Dropdown, { DropdownItem } from "../../ui/Dropdown";
import srFlag from "../../../assets/images/country-flags/sr-flag.png";
import enFlag from "../../../assets/images/country-flags/en-flag.png";

const flagOption = (flag: string, code: string) => (
  <span className="flex items-center gap-2.5 pr-3 text-sm font-medium">
    <img src={flag} alt="" className="h-4 w-5 rounded-sm object-cover" />
    {code}
  </span>
);

const NavbarLang = () => {
  const { i18n } = useTranslation();

  const currentLang = (i18n.resolvedLanguage || i18n.language || "en").startsWith(
    "sr"
  )
    ? "sr"
    : "en";

  const changeLanguage = (language: string) => i18n.changeLanguage(language);

  const languageItems: DropdownItem[] = [
    {
      key: "sr",
      label: flagOption(srFlag, "SR"),
      action: () => changeLanguage("sr"),
    },
    {
      key: "en",
      label: flagOption(enFlag, "EN"),
      action: () => changeLanguage("en"),
    },
  ];

  return (
    <Dropdown
      trigger={
        <span className="flex h-9 cursor-pointer items-center justify-center rounded-md px-2.5 text-sm font-medium tracking-wide text-white/85 transition-colors hover:bg-white/10 hover:text-white">
          {currentLang.toUpperCase()}
        </span>
      }
      items={languageItems}
      position="left"
    />
  );
};

export default NavbarLang;
