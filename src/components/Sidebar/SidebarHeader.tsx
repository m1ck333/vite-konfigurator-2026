import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SIDEBAR_HEADER_HEIGHT } from "../../constants";
import algreenLogo from "../../assets/images/algreen-logo-green.png";

export const SidebarHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-3 px-4 bg-white/25 border-b border-white/40 shrink-0"
      style={{ height: `${SIDEBAR_HEADER_HEIGHT - 1}px` }}
    >
      <Link to="/" aria-label="Algreen home">
        <img src={algreenLogo} alt="Algreen" className="h-7" />
      </Link>
      <span className="w-px h-7 bg-primary-grey-lightest" />
      <span className="text-base font-bold tracking-tight text-primary-green-dark">
        {t("configurator")}
      </span>
    </div>
  );
};
