import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { AppDispatch } from "../../../app/store";
import {
  logoutUser,
  selectIsLoggedIn,
  selectUserData,
} from "../../../features/user/userSlice";
import Dropdown, { DropdownItem } from "../../ui/Dropdown";
import PersonalInfo from "./PersonalInfo";
import { PersonalInfoProvider } from "./PersonalInfo/context/PersonalInfoContext";
import MyOffersModal from "../MyOffersModal";

interface UserDropdownMenuProps {
  setIsLoginModalShown: (boolean: boolean) => void;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  setIsLoginModalShown,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectUserData)?.role === "admin";

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isPersonalInfoModalVisible, setIsPersonalInfoModalVisible] =
    useState(false);
  const [isMyOffersModalOpen, setIsMyOffersModalOpen] = useState(false);

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      toast.success(t("auth-messages.logout-successfully"));
    } else {
      toast.error(t("auth-messages.logout-unsuccessfully"));
    }
  };

  const dropdownItems: DropdownItem[] = [
    {
      key: "personalInfo",
      label: t("personalInfo"),
      action: () => setIsPersonalInfoModalVisible(true),
    },
    {
      key: "my-offers",
      label: t("my-offers"),
      action: () => setIsMyOffersModalOpen(true),
    },
    { key: "notifications", label: t("notifications") },
  ];

  if (isAdmin) {
    dropdownItems.push({
      key: "adminPanel",
      label: t("adminPage"),
      action: () => navigate("/admin"),
    });
  }

  dropdownItems.push({
    key: "logout",
    label: t("logout"),
    action: handleLogout,
    isAdditional: true,
  });

  return isLoggedIn ? (
    <>
      <Dropdown
        trigger={
          <span className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer text-primary-grey-dark hover:bg-primary-grey-lightest hover:text-primary-green transition-colors">
            <FontAwesomeIcon icon={faGear} size="lg" />
          </span>
        }
        position="left"
        items={dropdownItems}
      />

      <PersonalInfoProvider>
        <PersonalInfo
          isModalOpen={isPersonalInfoModalVisible}
          setIsPersonalInfoModalVisible={setIsPersonalInfoModalVisible}
        />
      </PersonalInfoProvider>

      <MyOffersModal
        isOpen={isMyOffersModalOpen}
        setIsOpen={setIsMyOffersModalOpen}
      />
    </>
  ) : (
    <span
      onClick={() => setIsLoginModalShown(true)}
      className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer text-primary-grey-dark hover:bg-primary-grey-lightest hover:text-primary-green transition-colors"
    >
      <FontAwesomeIcon icon={faRightToBracket} size="lg" />
    </span>
  );
};

export default UserDropdownMenu;
