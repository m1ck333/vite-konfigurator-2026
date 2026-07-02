import React, { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SectionHeading from "../../ui/SectionHeading";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Table, { TableColumn } from "../../ui/Table";
import { EquipmentGlass } from "../../../types";
import AdminGlassesForm from "./AdminGlassesForm";
import { SkeletonTable } from "../../ui/Skeleton";
import Error from "../../ui/Error";
import StatusIndicator from "../AdminComponents/AdminTableItems/StatusIndicator";
import ImagePreview from "../AdminComponents/AdminTableItems/ImagePreview";
import AdminDeleteConfirmationModal from "../AdminComponents/AdminTableItems/AdminDeleteConfirmationModal";
import useEquipmentGlasses from "../../../hooks/useEquipmentGlasses";
import ActionButtons from "../../ui/Table/ActionButtons";

const AdminGlasses: React.FC = () => {
  const {
    glasses,
    error,
    isLoading,
    isMutating,
    deleteGlass,
    addOrUpdateGlass,
  } = useEquipmentGlasses();

  const [editingGlass, setEditingGlass] = useState<EquipmentGlass | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [glassToDelete, setGlassToDelete] = useState<EquipmentGlass | null>(
    null
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const handleDeleteClick = (glass: EquipmentGlass) => {
    setGlassToDelete(glass);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (glassToDelete) {
      try {
        await deleteGlass(glassToDelete.id);
        toast.success("Staklo je uspešno obrisan");
      } catch (error) {
        toast.error("Greška prilikom brisanja staklo");
      } finally {
        setGlassToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const handleAddOrUpdateGlass = async (glassData: Partial<EquipmentGlass>) => {
    try {
      await addOrUpdateGlass(editingGlass ? editingGlass.id : null, glassData);
      toast.success(
        editingGlass
          ? "Staklo je uspešno ažurirano"
          : "Staklo je uspešno dodato"
      );
    } catch (error) {
      toast.error("Greška prilikom čuvanja stakla");
    } finally {
      setIsFormModalOpen(false);
      setEditingGlass(null);
    }
  };

  const handleCancel = () => {
    setIsFormModalOpen(false);
    setEditingGlass(null);
  };

  const handleEditClick = (glass: EquipmentGlass) => {
    setEditingGlass(glass);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingGlass(null);
    setIsFormModalOpen(true);
  };

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: false },
    { header: "Naziv", accessor: "name", sortable: true, filterable: true },
    {
      header: "Cena",
      accessor: "price",
      render: (row: EquipmentGlass) =>
        row.price ? parseFloat(row.price).toFixed(2) : "-",
      sortable: true,
      filterable: true,
    },
    {
      header: "Redosled",
      accessor: "sort_order",
      render: (row: EquipmentGlass) =>
        row.sort_order ? `#${row.sort_order}` : "-",
      sortable: true,
    },
    {
      header: "Slika",
      accessor: "thumbnail",
      render: (row: EquipmentGlass) => (
        <ImagePreview
          thumbnail={row.thumbnail as string}
          name={row.id.toString()}
        />
      ),
    },
    {
      header: "Status",
      accessor: "is_shown",
      render: (row: EquipmentGlass) => (
        <StatusIndicator isShown={row.is_shown} />
      ),
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-4">
      <SectionHeading>Stakla</SectionHeading>

      <div className="flex justify-center">
        <Button
          icon={faPlus}
          onClick={handleAddNewClick}
          className="w-fit"
          disabled={isMutating}
        >
          Dodaj novo staklo
        </Button>
      </div>

      {isLoading && <SkeletonTable />}

      {error && <Error message="Došlo je do greške" />}

      {glasses && (
        <Table
          striped
          pagination
          columns={columns}
          data={glasses}
          actionButtons={(row: EquipmentGlass) => (
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
          title={editingGlass ? "Ažuriraj staklo" : "Dodaj novo staklo"}
        >
          <AdminGlassesForm
            glass={editingGlass}
            onSubmit={handleAddOrUpdateGlass}
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
        text="Da li ste sigurni da želite da obrišete ovo staklo?"
      />
    </div>
  );
};

export default AdminGlasses;
