import React from "react";
import { useSelector } from "react-redux";

import algreenLogoGreenWhiteBackground from "../../../../../assets/images/algreen-logo-green-white-background.png";
import { selectUserData } from "../../../../../features/user/userSlice";

const Header = () => {
  const userData = useSelector(selectUserData);

  const logoUrl = userData?.logo
    ? `${process.env.REACT_APP_API_URL}/storage/${userData.logo}`
    : algreenLogoGreenWhiteBackground;

  return (
    <div>
      <div className="flex justify-between items-center mb-1 pb-3">
        <img
          src={logoUrl}
          className="w-auto max-h-12 object-contain object-left"
          alt="Logo"
        />

        <div className="text-sm text-right">
          <p>
            <b>{userData?.company_name}</b>
          </p>
          <p>{userData?.address}</p>
          <p>{userData?.city}</p>
          {userData?.phone && <p>T: {userData.phone}</p>}
          {userData?.email && <p>E: {userData.email}</p>}
        </div>
      </div>

      <hr className="border-t border-gray-500 mb-6" />
    </div>
  );
};

export default Header;
