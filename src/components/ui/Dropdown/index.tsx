import React, { ReactNode, useRef, useState, useEffect } from "react";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export interface DropdownItem {
  key: string;
  label: ReactNode;
  action?: () => void;
  isAdditional?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  position?: "left" | "right";
  width?: string;
  showArrow?: boolean;
  triggerClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  className = "",
  position = "right",
  width,
  showArrow = true,
  triggerClassName = "",
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: false,
    right: false,
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useOutsideClick(dropdownRef, closeDropdown);

  // Check and adjust position whenever dropdown opens or window resizes
  useEffect(() => {
    const checkPosition = () => {
      if (!dropdownOpen || !menuRef.current || !dropdownRef.current) return;

      // Get the dropdown trigger position
      const triggerRect = dropdownRef.current.getBoundingClientRect();

      // Get the menu dimensions
      const menuRect = menuRef.current.getBoundingClientRect();

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate potential overflow
      const rightOverflow = triggerRect.left + menuRect.width > viewportWidth;
      const bottomOverflow =
        triggerRect.bottom + menuRect.height > viewportHeight;

      // Update position state
      setMenuPosition({
        right: rightOverflow,
        top: bottomOverflow,
      });
    };

    // Check position immediately after opening
    if (dropdownOpen) {
      // Use setTimeout to ensure the menu is rendered before measuring
      setTimeout(checkPosition, 0);
    }

    // Also check on window resize
    window.addEventListener("resize", checkPosition);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkPosition);
    };
  }, [dropdownOpen]);

  const mainItems = items.filter((item) => !item.isAdditional);
  const additionalItems = items.filter((item) => item.isAdditional);

  const variantClasses = {
    primary: "bg-primary-green text-white hover:bg-primary-green-dark",
    outline:
      "bg-white border border-primary-grey-light text-primary-grey-dark hover:border-primary-green hover:text-primary-green",
    minimal:
      "bg-transparent text-primary-grey-dark hover:bg-primary-light hover:text-primary-green",
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className={`inline-flex items-center gap-0.5 cursor-pointer ${triggerClassName}`}
      >
        <span>{trigger}</span>
        {showArrow && (
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            size="xs"
          />
        )}
      </div>

      {dropdownOpen && (
        <div
          ref={menuRef}
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            maxWidth: "calc(100vw - 20px)",
          }}
          className={`glass-modal absolute z-50 ${menuPosition.top ? "bottom-full mb-2" : "top-full mt-2"}
            ${position === "right" ? "left-0" : "right-0"}
            rounded-xl overflow-hidden transform origin-top scale-100
            transition-all duration-200 ease-in-out animate-dropdown
            min-w-fit ${width || ""}`}
        >
          <div className="py-1">
            {mainItems.map((item) => (
              <div
                key={item.key}
                onClick={() => {
                  if (!item.disabled && item.action) {
                    item.action();
                    closeDropdown();
                  }
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 whitespace-nowrap
                  ${
                    item.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : `cursor-pointer ${variantClasses.minimal}`
                  }
                `}
              >
                {item.icon && (
                  <span className="text-primary-grey">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </div>
            ))}

            {additionalItems.length > 0 && (
              <div className="flex justify-center">
                <hr className="my-1 w-11/12 border-primary-grey-lightest" />
              </div>
            )}

            {additionalItems.map((item) => (
              <div
                key={item.key}
                onClick={() => {
                  if (!item.disabled && item.action) {
                    item.action();
                    closeDropdown();
                  }
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 whitespace-nowrap
                  ${
                    item.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : `cursor-pointer ${variantClasses.minimal}`
                  }
                `}
              >
                {item.icon && (
                  <span className="text-primary-grey">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
