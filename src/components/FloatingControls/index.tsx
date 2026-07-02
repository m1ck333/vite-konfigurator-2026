import React, { useState } from "react";
import NavbarLang from "../Navbar/NavbarLang";
import LoginModal from "../Navbar/LoginModal";
import UserDropdownMenu from "../Navbar/UserDropdownMenu";

/**
 * Floating top-right controls (language + user/login) — replaces the old top
 * navbar in the full-bleed configurator layout.
 */
interface FloatingControlsProps {
  isSidebarOpen?: boolean;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  isSidebarOpen = false,
}) => {
  const [isLoginModalShown, setIsLoginModalShown] = useState(false);

  return (
    <>
      <div
        className={`glass-btn fixed top-4 right-4 z-50 items-center gap-1 rounded-full px-1.5 py-1 ${
          isSidebarOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <NavbarLang />
        <UserDropdownMenu setIsLoginModalShown={setIsLoginModalShown} />
      </div>

      <LoginModal
        isOpen={isLoginModalShown}
        onClose={() => setIsLoginModalShown(false)}
      />
    </>
  );
};

export default FloatingControls;
