import React from "react";
import SidebarNavigation from "./SidebarNavigation";
import SidebarContent from "./SidebarContent";
import ScrollFade from "../ui/ScrollFade";
import { activeSidebarItem } from "../../types";

interface SidebarBodyProps {
  activeItem: activeSidebarItem;
  handleItemClick: (item: activeSidebarItem) => void;
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({
  activeItem,
  handleItemClick,
}) => {
  return (
    <nav className="flex h-full min-h-0 w-full">
      <ScrollFade
        wrapperClassName="w-[184px] shrink-0 border-r border-[#1b1b1b] bg-[#0d0d0d]"
        fadeColorClass="from-[#0d0d0d]"
      >
        <SidebarNavigation
          handleItemClick={handleItemClick}
          activeItem={activeItem}
        />
      </ScrollFade>
      <ScrollFade
        wrapperClassName="min-w-0 flex-1 bg-white md:w-[400px] md:flex-none"
        className="px-6 py-6"
        fadeColorClass="from-white"
      >
        <SidebarContent activeItem={activeItem} />
      </ScrollFade>
    </nav>
  );
};
