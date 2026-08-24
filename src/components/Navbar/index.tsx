import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import NavbarLang from "./NavbarLang";
import algreenLogo from "../../assets/images/algreen-logo.png";
import { NAVBAR_HEIGHT } from "../../constants";
import LoginModal from "./LoginModal";
import UserDropdownMenu from "./UserDropdownMenu";
import { selectUserData } from "../../features/user/userSlice";
import { useSelector } from "react-redux";

interface NavbarProps {
  additionalFields?: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ additionalFields }) => {
  const [isLoginModalShown, setIsLoginModalShown] = useState(false);
  const loggedUser = useSelector(selectUserData);

  return (
    <>
      <nav
        className="relative z-50 bg-[#0d0d0d] px-4 sm:px-6 text-white"
        style={{
          height: `${NAVBAR_HEIGHT}px`,
        }}
      >
        <div className="w-full h-full flex justify-between items-center">
          {loggedUser?.role === "admin" || !loggedUser ? (
            <Link to="/">
              <img src={algreenLogo} alt="Algreen" className="h-7 brightness-0 invert" />
            </Link>
          ) : (
            <div />
          )}

          <div className="flex gap-4">
            {additionalFields}

            <NavbarLang />

            <UserDropdownMenu setIsLoginModalShown={setIsLoginModalShown} />
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalShown}
        onClose={() => setIsLoginModalShown(false)}
      />
    </>
  );
};

export default Navbar;
