import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavbarLang from "../Navbar/NavbarLang";
import UserDropdownMenu from "../Navbar/UserDropdownMenu";
import LoginModal from "../Navbar/LoginModal";
import algreenLogo from "../../assets/images/algreen-logo.png";

/**
 * Black top bar: ALGREEN logo (left) · KONFIGURATOR (center) · language + user/B2B (right).
 * Docked layout (replaces the old floating top-right controls).
 */
const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const [isLoginModalShown, setIsLoginModalShown] = useState(false);

  return (
    <header className="relative z-40 flex h-[60px] shrink-0 items-center bg-[#0d0d0d] px-6 text-white">
      <Link to="/" aria-label="Algreen home" className="flex items-center">
        {/* dark logo inverted to white for the black bar */}
        <img src={algreenLogo} alt="Algreen" className="h-7 brightness-0 invert" />
      </Link>

      <span className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-lg font-medium uppercase tracking-[0.3em] text-white/90 md:block">
        {t("configurator")}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <NavbarLang />
        <span className="hidden h-4 w-px bg-white/20 sm:block" />
        <UserDropdownMenu setIsLoginModalShown={setIsLoginModalShown} />
      </div>

      <LoginModal isOpen={isLoginModalShown} onClose={() => setIsLoginModalShown(false)} />
    </header>
  );
};

export default TopBar;
