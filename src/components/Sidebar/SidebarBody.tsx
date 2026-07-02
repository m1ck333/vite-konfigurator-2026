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
    <nav className="flex flex-1 min-h-0">
      <ScrollFade
        wrapperClassName="w-[76px] sm:w-[92px] shrink-0 border-r border-white/40 bg-white/15"
        fadeColorClass="from-white/40"
      >
        <SidebarNavigation
          handleItemClick={handleItemClick}
          activeItem={activeItem}
        />
      </ScrollFade>
      <ScrollFade
        wrapperClassName="flex-1 bg-white/5"
        className="py-3 px-4"
        fadeColorClass="from-white/30"
      >
        <SidebarContent activeItem={activeItem} />
      </ScrollFade>
    </nav>
  );
};
