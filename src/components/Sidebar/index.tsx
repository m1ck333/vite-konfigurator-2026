import React from "react";
import { SidebarBody } from "./SidebarBody";
import { useSidebar } from "../../hooks/useSidebar";

/**
 * Docked sidebar: black icon rail + white content panel, under the top bar.
 */
const Sidebar: React.FC = () => {
  const { activeItem, handleItemClick } = useSidebar();

  return (
    <aside className="flex h-full w-full">
      <SidebarBody activeItem={activeItem} handleItemClick={handleItemClick} />
    </aside>
  );
};

export default Sidebar;
