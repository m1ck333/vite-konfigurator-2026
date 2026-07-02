import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarBody } from "./SidebarBody";
import { useSidebar } from "../../hooks/useSidebar";

interface SidebarProps {
  hideSidebar: () => void;
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ hideSidebar, isSidebarOpen }) => {
  const { activeItem, handleItemClick } = useSidebar();

  return (
    <aside
      className={`fixed top-4 left-0 right-0 mx-auto w-[90vw] max-w-sm md:left-4 md:right-auto md:mx-0 md:w-[25rem] z-40 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-[130%]"
      }`}
    >
      <div className="glass-panel relative flex flex-col w-full h-[calc(100vh-2rem)] rounded-2xl overflow-hidden">
        <SidebarHeader />
        <SidebarBody activeItem={activeItem} handleItemClick={handleItemClick} />
      </div>

      {/* half-circle caret toggle glued to the card's right edge — collapses the sidebar */}
      <button
        onClick={hideSidebar}
        aria-label="Collapse sidebar"
        className="glass-btn absolute top-1/2 right-0 -translate-y-1/2 translate-x-full z-10 flex items-center justify-center w-6 h-16 rounded-r-full text-primary-grey-dark hover:text-primary-green transition-colors"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
      </button>
    </aside>
  );
};

export default Sidebar;
