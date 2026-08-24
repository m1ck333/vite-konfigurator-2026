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
        className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-3.5 text-sm font-medium transition-colors focus:outline-none ${
          isActive
            ? "bg-[#141619] text-primary-green"
            : "text-[#9a9ea3] hover:bg-white/5 hover:text-white"
        }`}
      >
        {/* active green accent bar at the rail's left edge */}
        <span
          className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full transition-colors ${
            isActive ? "bg-primary-green" : "bg-transparent"
          }`}
        />

        {/* masked line icon — tints via background-color */}
        <span
          aria-hidden
          className={`h-[22px] w-[22px] shrink-0 transition-colors ${
            isActive ? "bg-primary-green" : "bg-[#9a9ea3] group-hover:bg-white"
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

        <span className="whitespace-nowrap">{t(text)}</span>
      </button>
    </li>
  );
};

export default SidebarNavigationItem;
