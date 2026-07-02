import React, { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SectionHeading from "../../ui/SectionHeading";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Table, { TableColumn } from "../../ui/Table";
import { EquipmentSystem } from "../../../types";
import useEquipmentSystems from "../../../hooks/useEquipmentSystems";
import AdminSystemForm from "./AdminSystemForm";
import { SkeletonTable } from "../../ui/Skeleton";
import Error from "../../ui/Error";
import HTMLRenderer from "../../HTMLRenderer";
import StatusIndicator from "../AdminComponents/AdminTableItems/StatusIndicator";
import ImagePreview from "../AdminComponents/AdminTableItems/ImagePreview";
import AdminDeleteConfirmationModal from "../AdminComponents/AdminTableItems/AdminDeleteConfirmationModal";
import ActionButtons from "../../ui/Table/ActionButtons";

const AdminSystems: React.FC = () => {
  const {
    systems,
    error,
    isLoading,
    isMutating,
    deleteSystem,
    addOrUpdateSystem,
  } = useEquipmentSystems();

  const [editingSystem, setEditingSystem] = useState<EquipmentSystem | null>(
    null
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [systemToDelete, setSystemToDelete] = useState<EquipmentSystem | null>(
    null
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const handleDeleteClick = (system: EquipmentSystem) => {
    setSystemToDelete(system);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (systemToDelete) {
      try {
        await deleteSystem(systemToDelete.id);
        toast.success("Sistem je uspešno obrisan");
      } catch (error) {
        toast.error("Greška prilikom brisanja sistema");
      } finally {
        setSystemToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const handleAddOrUpdateSystem = async (
    systemData: Partial<EquipmentSystem>
  ) => {
    try {
      await addOrUpdateSystem(
        editingSystem ? editingSystem.id : null,
        systemData
      );
      toast.success(
        editingSystem ? "Sistem je uspešno ažuriran" : "Sistem je uspešno dodat"
      );
    } catch (error) {
      toast.error("Greška prilikom čuvanja sistema");
    } finally {
      setIsFormModalOpen(false);
      setEditingSystem(null);
    }
  };

  const handleCancel = () => {
    setIsFormModalOpen(false);
    setEditingSystem(null);
  };

  const handleEditClick = (system: EquipmentSystem) => {
    setEditingSystem(system);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingSystem(null);
    setIsFormModalOpen(true);
  };

  const columns: TableColumn[] = [
    { header: "Šifra", accessor: "code", sortable: true, filterable: true },
    { header: "Naziv", accessor: "name", sortable: true, filterable: true },
    {
      header: "Opis",
      accessor: "description",
      render: (row: EquipmentSystem) => (
        <HTMLRenderer htmlContent={row.description || "-"} />
      ),
      filterable: true,
    },
    {
      header: "Cena",
      accessor: "price",
      render: (row: EquipmentSystem) =>
        row.price ? parseFloat(row.price).toFixed(2) : "-",
      sortable: true,
      filterable: true,
    },
    {
      header: "Redosled",
      accessor: "sort_order",
      render: (row: EquipmentSystem) =>
        row.sort_order ? `#${row.sort_order}` : "-",
      sortable: true,
    },
    {
      header: "Slika",
      accessor: "thumbnail",
      render: (row: EquipmentSystem) => (
        <ImagePreview thumbnail={row.thumbnail as string} name={row.name} />
      ),
    },
    {
      header: "Status",
      accessor: "is_shown",
      render: (row: EquipmentSystem) => (
        <StatusIndicator isShown={row.is_shown} />
      ),
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-4">
      <SectionHeading>Sistemi</SectionHeading>

      <div className="flex justify-center">
        <Button
          icon={faPlus}
          onClick={handleAddNewClick}
          className="w-fit"
          disabled={isMutating}
        >
          Dodaj novi sistem
        </Button>
      </div>

      {isLoading && <SkeletonTable />}

      {error && <Error message="Došlo je do greške" />}

      {systems && (
        <Table
          striped
          pagination
          columns={columns}
          data={systems}
          actionButtons={(row: EquipmentSystem) => (
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
          title={editingSystem ? "Ažuriraj sistem" : "Dodaj novi sistem"}
        >
          <AdminSystemForm
            system={editingSystem}
            onSubmit={handleAddOrUpdateSystem}
            onCancel={handleCancel}
            isMutating={isMutating}
          />
        </Modal>
      )}

      <AdminDeleteConfirmationModal
        isMutating={isMutating}
        setIsConfirmModalOpen={setIsConfirmModalOpen}
        handleConfirmDelete={handleConfirmDelete}
        isConfirmModalOpen={isConfirmModalOpen}
        text="Da li ste sigurni da želite da obrišete ovaj sistem?"
      />
    </div>
  );
};

export default AdminSystems;
