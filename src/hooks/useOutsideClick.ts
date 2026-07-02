import { useEffect } from "react";

const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  onOutsideClick?: () => void,
  useBackdrop: boolean = false
) => {
  useEffect(() => {
    if (!onOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = ref.current;
      const backdrop = useBackdrop ? modalElement?.parentElement : null;

      if (useBackdrop && backdrop && event.target === backdrop) {
        onOutsideClick();
      } else if (
        !useBackdrop &&
        modalElement &&
        !modalElement.contains(event.target as Node)
      ) {
        onOutsideClick();
      }
    };

    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapePress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [ref, onOutsideClick, useBackdrop]);
};

export default useOutsideClick;
