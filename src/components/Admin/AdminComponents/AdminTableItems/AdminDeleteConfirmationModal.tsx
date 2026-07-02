import React from "react";
import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";

interface AdminDeleteConfirmationModalProps {
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmDelete: () => void;
  isMutating: boolean;
  text: string;
}

const AdminDeleteConfirmationModal = ({
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  handleConfirmDelete,
  isMutating,
  text,
}: AdminDeleteConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isConfirmModalOpen}
      onClose={() => setIsConfirmModalOpen(false)}
      title="Potvrda brisanja"
    >
      <div className="space-y-4">
        <p>{text}</p>

        <div className="flex space-x-4">
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={isMutating}
          >
            Da, obriši
          </Button>
          <Button
            onClick={() => setIsConfirmModalOpen(false)}
            disabled={isMutating}
          >
            Odustani
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminDeleteConfirmationModal;
