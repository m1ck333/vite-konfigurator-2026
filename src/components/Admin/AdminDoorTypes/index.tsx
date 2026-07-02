import React, { useState } from "react";
import SectionHeading from "../../ui/SectionHeading";
import Button from "../../ui/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SkeletonTable } from "../../ui/Skeleton";
import { useDoors } from "../../../hooks/useDoors";
import Error from "../../ui/Error";
import TabSwitcher from "../../ui/TabSwitcher";
import Table, { TableColumn } from "../../ui/Table";
import { toast } from "react-toastify";
import { Door } from "../../../types";
import Modal from "../../ui/Modal";
import AdminDeleteConfirmationModal from "../AdminComponents/AdminTableItems/AdminDeleteConfirmationModal";
import AdminDoorForm from "./AdminDoorForm";
import ImagePreview from "../AdminComponents/AdminTableItems/ImagePreview";
import StatusIndicator from "../AdminComponents/AdminTableItems/StatusIndicator";
import ActionButtons from "../../ui/Table/ActionButtons";
import { useColors } from "../../../hooks/useColors";

const AdminDoorTypes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "without-glass" | "with-glass"
  >("all");
  const [editingDoor, setEditingDoor] = useState<Door | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [doorToDelete, setDoorToDelete] = useState<Door | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { doors, isLoading, isError, deleteDoor, addOrUpdateDoor } =
    useDoors(activeTab);
  const { colors } = useColors();

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: false },
    {
      header: "Model Code",
      accessor: "model_code",
      sortable: true,
      filterable: true,
    },
    {
      header: "Cena",
      accessor: "price",
      render: (row: Door) =>
        row.price ? parseFloat(row.price).toFixed(2) : "-",
      sortable: true,
      filterable: true,
    },
    {
      header: "Redosled",
      accessor: "sort_order",
      render: (row: Door) => (row.sort_order ? `#${row.sort_order}` : "-"),
      sortable: true,
    },
    {
      header: "Slika",
      accessor: "thumbnail",
      render: (row: Door) => (
        <ImagePreview
          isNonRectangular
          thumbnail={row.thumbnail as string}
          name={row.model_code}
        />
      ),
    },
    {
      header: "Status",
      accessor: "is_shown",
      render: (row: Door) => <StatusIndicator isShown={row.is_shown} />,
      sortable: true,
    },
  ];

  const handleAddOrUpdateDoor = async (doorData: Partial<Door>) => {
    try {
      const success = await addOrUpdateDoor(
        editingDoor ? editingDoor.id : null,
        doorData
      );

      if (success) {
        toast.success(
          editingDoor ? "Vrata su uspešno ažurirana" : "Vrata su uspešno dodata"
        );
        setIsFormModalOpen(false);
        setEditingDoor(null);
      } else {
        toast.error("Greška prilikom čuvanja vrata");
      }
    } catch (error) {
      toast.error("Došlo je do greške pri čuvanju vrata");
    }
  };

  const handleCancel = () => {
    setIsFormModalOpen(false);
    setEditingDoor(null);
  };

  const handleDeleteClick = (door: Door) => {
    setDoorToDelete(door);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (doorToDelete) {
      try {
        await deleteDoor(doorToDelete.id);
        toast.success("Vrata je uspešno obrisana");
      } catch (error) {
        toast.error("Greška prilikom brisanja vrata");
      } finally {
        setDoorToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const handleEditClick = (door: Door) => {
    setEditingDoor(door);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingDoor(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <SectionHeading>Modeli vrata</SectionHeading>

      <TabSwitcher
        activeTab={activeTab}
        tabs={[
          { label: "Sva", value: "all" },
          { label: "Bez stakla", value: "without-glass" },
          { label: "Sa staklom", value: "with-glass" },
        ]}
        onTabChange={setActiveTab}
      />

      <div className="flex justify-center">
        <Button
          icon={faPlus}
          onClick={handleAddNewClick}
          className="w-fit"
          disabled={isLoading}
        >
          Dodaj nova vrata
        </Button>
      </div>

      {isLoading && <SkeletonTable />}

      {isError && <Error message="Došlo je do greške" />}

      {doors && doors.length > 0 && (
        <Table
          striped
          pagination
          columns={columns}
          data={doors}
          actionButtons={(row: Door) => (
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
          title={editingDoor ? "Ažuriraj boju" : "Dodaj novu boju"}
        >
          <AdminDoorForm
            door={editingDoor}
            colors={colors}
            onSubmit={handleAddOrUpdateDoor}
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
        text="Da li ste sigurni da želite da obrišete ovaj model?"
      />
    </div>
  );
};

export default AdminDoorTypes;
