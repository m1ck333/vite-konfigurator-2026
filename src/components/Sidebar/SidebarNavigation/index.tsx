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
  <ul className="flex min-h-full flex-col gap-0.5 px-2 py-3">
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
