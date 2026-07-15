import TypeIcon from "../../../assets/images/sidebar-icons/type.png";
import SystemIcon from "../../../assets/images/sidebar-icons/system.png";
import ColorIcon from "../../../assets/images/sidebar-icons/color.png";
import InsertDoorIcon from "../../../assets/images/sidebar-icons/insert-door.png";
import GlassIcon from "../../../assets/images/sidebar-icons/glass.png";
import EquipmentIcon from "../../../assets/images/sidebar-icons/equipment.png";
import DoorModelIcon from "../../../assets/images/sidebar-icons/door-model.png";
import DoorLockIcon from "../../../assets/images/sidebar-icons/door-lock.png";
import Document from "../../../assets/images/sidebar-icons/document.png";
import ConstructionIcon from "../../../assets/images/sidebar-icons/construction.png";

import { activeSidebarItem } from "../../../types";

const items = [
  { icon: TypeIcon, text: "type" as activeSidebarItem },
  { icon: SystemIcon, text: "systems" as activeSidebarItem },
  { icon: DoorModelIcon, text: "door-model" as activeSidebarItem },
  { icon: ConstructionIcon, text: "construction" as activeSidebarItem },
  { icon: ColorIcon, text: "color" as activeSidebarItem },
  { icon: GlassIcon, text: "glass" as activeSidebarItem },
  { icon: EquipmentIcon, text: "equipment" as activeSidebarItem },
  { icon: DoorLockIcon, text: "lock" as activeSidebarItem },
  { icon: InsertDoorIcon, text: "insert-the-door" as activeSidebarItem },
  { icon: Document, text: "print-query" as activeSidebarItem },
];

export default items;
