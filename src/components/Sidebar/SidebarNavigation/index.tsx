import React from "react";

import SidebarItem from "./SidebarNavigationItem";
import items from "./SidebarNavigationItems";
import { activeSidebarItem } from "../../../types";

interface SidebarNavigationProps {
  handleItemClick: (text: activeSidebarItem) => void;
  activeItem: activeSidebarItem;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  handleItemClick,
  activeItem,
}) => (
  <ul className="flex flex-col min-h-full py-2">
    {items.map((item) => (
      <SidebarItem
        key={item.text}
        icon={item.icon}
        text={item.text}
        onClick={() => handleItemClick(item.text)}
        isActive={activeItem === item.text}
      />
    ))}
  </ul>
);

export default SidebarNavigation;
