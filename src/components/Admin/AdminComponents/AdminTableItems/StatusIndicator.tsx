import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

interface StatusIndicatorProps {
  isShown: boolean | undefined;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isShown }) => {
  if (isShown === undefined) return <span>-</span>;

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${
          isShown ? "bg-primary-green" : "bg-danger"
        } text-white h-6 w-6 rounded-full flex justify-center items-center`}
      >
        <FontAwesomeIcon icon={isShown ? faCheck : faTimes} />
      </div>
    </div>
  );
};

export default StatusIndicator;
