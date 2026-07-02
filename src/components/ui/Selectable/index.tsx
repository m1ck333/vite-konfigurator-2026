import React, { MouseEventHandler, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

type SelectableProps = {
  isSelected: boolean;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  classNames?: string;
};

const Selectable: React.FC<SelectableProps> = ({
  isSelected,
  children,
  onClick,
  classNames = "",
}) => {
  const selectedClass = isSelected
    ? "border-primary-green bg-white shadow-[0_12px_30px_-10px_rgba(5,130,116,0.55)]"
    : "border-transparent bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.22)] hover:border-primary-green-light";
  const textClass = isSelected
    ? "text-primary-green-dark"
    : "text-primary-grey-dark";

  const iconWrapperStyle = `
    absolute top-2.5 right-2.5 flex justify-center items-center
    bg-primary-green text-white rounded-full h-6 w-6 ring-2 ring-white shadow-sm
    animate-fade-in-up
  `;

  return (
    <div
      className={`relative cursor-pointer rounded-2xl border-2 py-5 px-3 flex flex-col items-center transition-all duration-200 overflow-hidden w-full hover:-translate-y-1 ${selectedClass} ${textClass} ${classNames}`}
      onClick={onClick}
    >
      {children}

      {isSelected && (
        <div className={iconWrapperStyle}>
          <FontAwesomeIcon icon={faCheck} className="text-xs" />
        </div>
      )}
    </div>
  );
};

export default Selectable;
