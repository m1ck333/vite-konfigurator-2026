import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Dropdown from "../ui/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

const AdditionalNavItems = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownItems = [
    {
      key: "homePage",
      label: t("homePage"),
      path: "/admin",
      action: () => navigate("/admin"),
    },
    {
      key: "users",
      label: t("users"),
      path: "/admin/users",
      action: () => navigate("/admin/users"),
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:flex">
        {dropdownItems.map((item) => (
          <Button
            variant="link"
            key={item.key}
            onClick={item.action}
            className={`no-underline ${
              isActive(item.path)
                ? "text-primary-green font-semibold"
                : "text-black"
            }`}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <Dropdown
          trigger={
            <span className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer text-primary-grey-dark hover:bg-primary-grey-lightest hover:text-primary-green transition-colors">
              <FontAwesomeIcon icon={faBars} size="lg" />
            </span>
          }
          items={dropdownItems.map((item) => ({
            ...item,
            className: isActive(item.path) ? "text-primary-green" : "",
          }))}
        />
      </div>
    </>
  );
};

export default AdditionalNavItems;
