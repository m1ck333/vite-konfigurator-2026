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
    : "border-primary-grey-lightest bg-white hover:border-primary-green-light hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]";
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
      className={`relative flex w-full cursor-pointer flex-col items-center overflow-hidden rounded-lg border py-4 px-3 transition-all duration-200 hover:-translate-y-0.5 ${selectedClass} ${textClass} ${classNames}`}
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
