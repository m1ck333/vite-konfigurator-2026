import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

import { User } from "../../../types";
import Button from "../../ui/Button";
import { isAdminRole } from "../../../features/user/userSlice";

interface UserActionButtonsProps {
  row: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  row,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex space-x-2">
      <Button onClick={() => onEdit(row)} disabled={isAdminRole(row.role)}>
        <FontAwesomeIcon icon={faPen} />
      </Button>

      <Button
        variant="danger"
        onClick={() => onDelete(row)}
        disabled={isAdminRole(row.role)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  );
};

export default UserActionButtons;
