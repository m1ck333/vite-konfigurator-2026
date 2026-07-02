import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveItem,
  setActiveItem,
} from "../features/sidebar/sidebarSlice";
import { activeSidebarItem } from "../types";

export function useSidebar() {
  const dispatch = useDispatch();
  const activeItem = useSelector(selectActiveItem);

  const handleItemClick = (item: activeSidebarItem) => {
    dispatch(setActiveItem(item));
  };

  return { activeItem, handleItemClick };
}
