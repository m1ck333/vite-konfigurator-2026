import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faRotate } from "@fortawesome/free-solid-svg-icons";

import { setConfigurationField } from "../../../features/configuration/configurationSlice";
import { RootState } from "../../../app/store";

const floatingBtn =
  "glass-btn inline-flex items-center gap-2 h-11 rounded-full px-4 text-sm font-medium text-primary-grey-dark hover:text-primary-green transition-colors";

interface SidebarControlsProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  children,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const interiorDoorShown = useSelector(
    (state: RootState) => state.configuration.interiorDoorShown
  );

  const toggleDoorSide = () => {
    dispatch(
      setConfigurationField({
        field: "interiorDoorShown",
        value: !interiorDoorShown,
      })
    );
  };

  return (
    <>
      {children}

      {/* open toggle — half-circle caret glued to the left screen edge (when collapsed) */}
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open sidebar"
          className="glass-btn fixed left-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-6 h-16 rounded-r-full text-primary-grey-dark hover:text-primary-green transition-colors"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
        </button>
      )}

      {/* inner / outer view toggle */}
      <div
        className="fixed z-30 transition-all duration-300"
        style={{
          top: "1rem",
          left: isSidebarOpen ? "calc(25rem + 2.5rem)" : "1.75rem",
        }}
      >
        <button
          type="button"
          onClick={toggleDoorSide}
          className={`${floatingBtn} ${
            isSidebarOpen ? "hidden md:inline-flex" : "inline-flex"
          }`}
        >
          <FontAwesomeIcon icon={faRotate} />
          <span className="w-max">
            {t(interiorDoorShown ? "door-outer-view" : "door-inner-view")}
          </span>
        </button>
      </div>
    </>
  );
};
