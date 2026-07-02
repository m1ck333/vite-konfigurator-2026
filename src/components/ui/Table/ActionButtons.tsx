import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex justify-center items-center space-x-2 h-full">
      <Button
        variant="icon"
        onClick={onEdit}
        className="text-primary-green hover:text-primary-green-dark"
      >
        <FontAwesomeIcon icon={faPen} />
      </Button>
      <Button
        variant="icon"
        onClick={onDelete}
        className="text-danger hover:text-danger-dark"
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  );
};

export default ActionButtons;
