import React from "react";
import { useTranslation } from "react-i18next";

interface SidebarNavigationItemProps {
  icon: string;
  text: string;
  onClick: () => void;
  isActive: boolean;
}

const SidebarNavigationItem: React.FC<SidebarNavigationItemProps> = ({
  icon,
  text,
  onClick,
  isActive,
}) => {
  const { t } = useTranslation();

  return (
    <li>
      <button
        onClick={onClick}
        aria-current={isActive ? "step" : undefined}
        title={t(text)}
        className={`group relative w-full flex flex-col items-center gap-1.5 px-1.5 py-3 transition-colors duration-200 focus:outline-none ${
          isActive ? "bg-white" : "hover:bg-white/70"
        }`}
      >
        {/* active accent bar */}
        <span
          className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-all duration-200 ${
            isActive ? "bg-primary-green" : "bg-transparent"
          }`}
        />

        {/* icon tile */}
        <span
          className={`relative flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-200 group-hover:scale-105 group-active:scale-95 ${
            isActive
              ? "bg-primary-green/10 border-primary-green shadow-sm"
              : "bg-white border-primary-grey-lightest group-hover:border-primary-green-light"
          }`}
        >
          <span
            aria-hidden
            className={`h-5 w-5 transition-colors duration-200 ${
              isActive
                ? "bg-primary-green"
                : "bg-primary-grey-dark group-hover:bg-primary-green-light"
            }`}
            style={{
              maskImage: `url(${icon})`,
              WebkitMaskImage: `url(${icon})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskSize: "contain",
              WebkitMaskSize: "contain",
            }}
          />
        </span>

        <span
          className={`text-[11px] leading-tight text-center font-medium transition-colors ${
            isActive ? "text-primary-green-dark" : "text-primary-grey-dark"
          }`}
        >
          {t(text)}
        </span>
      </button>
    </li>
  );
};

export default SidebarNavigationItem;
