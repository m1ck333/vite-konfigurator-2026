import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { selectActiveItem } from "../features/sidebar/sidebarSlice";

export const useBackgroundImage = () => {
  const activeItem = useSelector(selectActiveItem);
  const colorImageUrl = useSelector(
    (state: RootState) => state.background.colorImageUrl
  );
  const houseImageUrl = useSelector(
    (state: RootState) => state.background.houseImageUrl
  );

  const backgroundImage =
    activeItem === "insert-the-door" ? houseImageUrl : colorImageUrl;

  return { backgroundImage };
};
