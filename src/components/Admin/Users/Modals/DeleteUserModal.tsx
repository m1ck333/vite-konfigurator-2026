import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import Modal from "../../../ui/Modal";
import Button from "../../../ui/Button";
import { User } from "../../../../types";
import { AppDispatch } from "../../../../app/store";
import { deleteUser } from "../../../../features/user/userSlice";
import { useUsers } from "../../../../hooks/useUsers";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User;
}

const DeleteUserModal = ({
  isOpen,
  onClose,
  selectedUser,
}: DeleteUserModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useUsers(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const resultAction = await dispatch(deleteUser(selectedUser.id));
      unwrapResult(resultAction);
      toast.success(t("auth-messages.delete-successfully"));
      await refetch();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(t(error.message));
      } else {
        toast.error(t("auth-messages.an-unknown-error-occurred"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Brisanje korisnika">
      <p className="mb-4">{`Da li ste sigurni da želite da obrišete korisnika ${selectedUser?.username}?`}</p>

      <div className="flex justify-end space-x-2">
        <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
          Da
        </Button>
        <Button onClick={onClose}>Ne</Button>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
