import React, { useState } from "react";
import SectionHeading from "../../ui/SectionHeading";
import Button from "../../ui/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SkeletonTable } from "../../ui/Skeleton";
import Error from "../../ui/Error";
import Table, { TableColumn } from "../../ui/Table";
import { toast } from "react-toastify";
import { EquipmentLock } from "../../../types";
import Modal from "../../ui/Modal";
import AdminDeleteConfirmationModal from "../AdminComponents/AdminTableItems/AdminDeleteConfirmationModal";
import ImagePreview from "../AdminComponents/AdminTableItems/ImagePreview";
import StatusIndicator from "../AdminComponents/AdminTableItems/StatusIndicator";
import { useLocks } from "../../../hooks/useLocks";
import AdminLockForm from "./AdminLockForm";
import ActionButtons from "../../ui/Table/ActionButtons";

const AdminLocks: React.FC = () => {
  const [editingLock, setEditingLock] = useState<EquipmentLock | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [lockToDelete, setLockToDelete] = useState<EquipmentLock | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { locks, isLoading, isError, deleteLock, addOrUpdateLock } = useLocks();

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: false },
    {
      header: "Naziv",
      accessor: "sr_name",
      sortable: true,
      filterable: true,
    },
    {
      header: "Cena",
      accessor: "price",
      render: (row: EquipmentLock) => parseFloat(row.price).toFixed(2),
      sortable: true,
      filterable: true,
    },
    {
      header: "Redosled",
      accessor: "sort_order",
      render: (row: EquipmentLock) =>
        row.sort_order ? `#${row.sort_order}` : "-",
      sortable: true,
    },
    {
      header: "Slika",
      accessor: "thumbnail",
      render: (row: EquipmentLock) => (
        <ImagePreview thumbnail={row.thumbnail as string} name={row.code} />
      ),
    },
    {
      header: "Status",
      accessor: "is_shown",
      render: (row: EquipmentLock) => (
        <StatusIndicator isShown={row.is_shown} />
      ),
      sortable: true,
    },
  ];

  const handleAddOrUpdateLock = async (lockData: Partial<EquipmentLock>) => {
    try {
      await addOrUpdateLock(editingLock ? editingLock.id : null, lockData);
      toast.success(
        editingLock ? "Brava uspešno ažurirana" : "Brava uspešno kreirana"
      );
    } catch (error) {
      toast.error("Greška prilikom snimanja brave");
    } finally {
      setIsFormModalOpen(false);
      setEditingLock(null);
    }
  };

  const handleCancel = () => {
    setIsFormModalOpen(false);
    setEditingLock(null);
  };

  const handleDeleteClick = (lock: EquipmentLock) => {
    setLockToDelete(lock);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (lockToDelete) {
      try {
        await deleteLock(lockToDelete.id);
        toast.success("Lock deleted successfully");
      } catch (error) {
        toast.error("Error deleting lock");
      } finally {
        setLockToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const handleEditClick = (lock: EquipmentLock) => {
    setEditingLock(lock);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingLock(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <SectionHeading>Brave</SectionHeading>

      <div className="flex justify-center">
        <Button
          icon={faPlus}
          onClick={handleAddNewClick}
          className="w-fit"
          disabled={isLoading}
        >
          Dodaj novu bravu
        </Button>
      </div>

      {isLoading && <SkeletonTable />}

      {isError && <Error message="Greška prilikom učitavanja" />}

      {locks && locks.length > 0 && (
        <Table
          striped
          pagination
          columns={columns}
          data={locks}
          actionButtons={(row: EquipmentLock) => (
            <ActionButtons
              onEdit={() => handleEditClick(row)}
              onDelete={() => handleDeleteClick(row)}
            />
          )}
        />
      )}

      {isFormModalOpen && (
        <Modal
          isOpen={isFormModalOpen}
          onClose={handleCancel}
          title={editingLock ? "Ažuriraj bravu" : "Dodaj novu bravu"}
        >
          <AdminLockForm
            lock={editingLock}
            onSubmit={handleAddOrUpdateLock}
            onCancel={handleCancel}
            isMutating={isLoading}
          />
        </Modal>
      )}

      <AdminDeleteConfirmationModal
        isMutating={isLoading}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        handleConfirmDelete={handleConfirmDelete}
        isConfirmModalOpen={isConfirmModalOpen}
        text="Da li ste sigurni da želite da obrišete ovu bravu?"
      />
    </div>
  );
};

export default AdminLocks;
