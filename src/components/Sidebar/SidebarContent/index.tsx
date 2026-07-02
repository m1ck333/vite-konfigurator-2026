import React from "react";
import { activeSidebarItem } from "../../../types";
import DoorTypes from "./DoorTypes";
import Systems from "./Systems";
import DoorModel from "./DoorModel";
import Construction from "./Construction";
import Color from "./Color";
import Glass from "./Glass";
import Equipment from "./Equipment";
import Lock from "./Lock";
import HouseColors from "./HouseColors";
import Houses from "./Houses";
import PrintQuery from "./PrintQuery";

type ContentComponents = {
  [K in Exclude<activeSidebarItem, "insert-the-door">]: React.FC<any>;
};

const contentMap: ContentComponents = {
  type: DoorTypes,
  systems: Systems,
  "door-model": DoorModel,
  construction: Construction,
  color: Color,
  glass: Glass,
  equipment: Equipment,
  lock: Lock,
  "house-colors": HouseColors,
  "print-query": PrintQuery,
};

interface SidebarContentProps {
  activeItem: activeSidebarItem;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ activeItem }) => {
  const Content =
    activeItem === "insert-the-door" ? Houses : contentMap[activeItem];

  if (!Content) return null;

  // key on activeItem so the content re-mounts and fades in on each step change
  return (
    <div key={activeItem} className="animate-fade-in-up">
      <Content />
    </div>
  );
};

export default SidebarContent;
