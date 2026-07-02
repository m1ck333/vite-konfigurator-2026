import React, { useState } from "react";
import Modal from "../../../ui/Modal";
import AdminOtherEquipmentForm from "./AdminOtherEquipmentForm";
import AdminDeleteConfirmationModal from "../AdminTableItems/AdminDeleteConfirmationModal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../ui/Button";
import { EquipmentOther } from "../../../../types";
import Table, { TableColumn } from "../../../ui/Table";
import Error from "../../../ui/Error";
import { SkeletonTable } from "../../../ui/Skeleton";
import SectionHeading from "../../../ui/SectionHeading";
import { toast } from "react-toastify";
import { useEquipmentOthers } from "../../../../hooks/useEquipmentOthers";
import StatusIndicator from "../AdminTableItems/StatusIndicator";
import ImagePreview from "../AdminTableItems/ImagePreview";
import TabSwitcher from "../../../ui/TabSwitcher";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../../ui/Table/ActionButtons";
import { getEquipmentPictureVisibility } from "../../../../utils";

const AdminOtherEquipment: React.FC = () => {
  const { t } = useTranslation();
  const [editingEquipment, setEditingEquipment] =
    useState<EquipmentOther | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] =
    useState<EquipmentOther | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeTableTab, setActiveTableTab] = useState<string>("equipment");
  const [activeCategoryName, setActiveCategoryName] =
    useState<string>("handrail");

  const {
    isLoading,
    isError,
    equipmentOthers,
    equipmentOthersSubcategories,
    deleteEquipmentOther,
    addOrUpdateEquipmentOther,
  } = useEquipmentOthers();

  const categories = equipmentOthers
    ? Object.keys(equipmentOthers).map((categoryName) => ({
        label: t(categoryName),
        value: categoryName,
      }))
    : [];

  const filteredEquipments: EquipmentOther[] =
    equipmentOthers && activeCategoryName
      ? //@ts-ignore
        equipmentOthers[activeCategoryName]?.equipments.filter(
          (equipment: EquipmentOther) =>
            activeTableTab === "equipment"
              ? !equipment.is_subcategory
              : equipment.is_subcategory
        ) || []
      : [];

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: false },
    {
      header: "Šifra",
      accessor: "code",
      sortable: true,
      filterable: true,
    },
    {
      header: "Naziv",
      accessor: "sr_name",
      sortable: true,
      filterable: true,
    },
    {
      header: "Cena",
      accessor: "price",
      render: (row: EquipmentOther) =>
        row.is_subcategory ? "-" : parseFloat(row.price).toFixed(2),
      sortable: true,
      filterable: true,
    },
    {
      header: "Redosled",
      accessor: "sort_order",
      render: (row: EquipmentOther) =>
        row.sort_order ? `#${row.sort_order}` : "-",
      sortable: true,
    },
    {
      header: "Slika",
      accessor: "thumbnail",
      render: (row: EquipmentOther) => (
        <ImagePreview
          thumbnail={
            getEquipmentPictureVisibility(row).showThumbnail
              ? typeof row.thumbnail === "string"
                ? row.thumbnail
                : null
              : typeof row.image === "string"
                ? row.image
                : null
          }
          name={row.code}
        />
      ),
    },
    {
      header: "Podkategorija",
      accessor: "subcategory",
      render: (row: EquipmentOther) =>
        row.subcategory ? row.subcategory : "-",
      sortable: true,
    },
    {
      header: "Status",
      accessor: "is_shown",
      render: (row: EquipmentOther) => (
        <StatusIndicator isShown={row.is_shown} />
      ),
      sortable: true,
    },
  ];

  const handleAddOrUpdateEquipment = async (
    equipmentData: Partial<EquipmentOther>
  ) => {
    try {
      await addOrUpdateEquipmentOther(
        editingEquipment ? editingEquipment.id : null,
        equipmentData
      );
      toast.success(
        editingEquipment
          ? "Oprema uspešno ažurirana"
          : "Oprema uspešno kreirana"
      );
    } catch (error) {
      toast.error("Greška prilikom snimanja opreme");
    } finally {
      setIsFormModalOpen(false);
      setEditingEquipment(null);
    }
  };

  const handleCancel = () => {
    setIsFormModalOpen(false);
    setEditingEquipment(null);
  };

  const handleDeleteClick = (equipment: EquipmentOther) => {
    setEquipmentToDelete(equipment);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (equipmentToDelete) {
      try {
        await deleteEquipmentOther(equipmentToDelete.id);
        toast.success("Oprema je uspešno obrisana");
      } catch (error) {
        toast.error("Oprema nije obrisana. Došlo je do greške.");
      } finally {
        setEquipmentToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const handleEditClick = (equipment: EquipmentOther) => {
    setEditingEquipment(equipment);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingEquipment(null);
    setIsFormModalOpen(true);
  };

  const handleTabChange = (category: string) => {
    setActiveCategoryName(category);
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <SectionHeading>Oprema</SectionHeading>

      <TabSwitcher
        activeTab={activeCategoryName}
        tabs={categories}
        onTabChange={handleTabChange}
      />

      <div className="flex justify-center items-center gap-4">
        <Button
          icon={faPlus}
          onClick={handleAddNewClick}
          className="w-fit h-11 flex items-center"
          disabled={isLoading}
        >
          Dodaj novu opremu
        </Button>

        <TabSwitcher
          activeTab={activeTableTab}
          tabs={[
            { label: "Oprema", value: "equipment" },
            { label: "Podkategorije opreme", value: "subcategories" },
          ]}
          onTabChange={(activeTab) => setActiveTableTab(activeTab)}
        />
      </div>

      {isLoading && <SkeletonTable />}

      {isError && <Error message="Greška prilikom učitavanja" />}

      {filteredEquipments.length > 0 && (
        <Table
          striped
          pagination
          columns={columns}
          data={filteredEquipments}
          actionButtons={(row: EquipmentOther) => (
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
          title={editingEquipment ? "Ažuriraj opremu" : "Dodaj novu opremu"}
        >
          <AdminOtherEquipmentForm
            equipment={editingEquipment}
            subcategories={equipmentOthersSubcategories ?? null}
            onSubmit={handleAddOrUpdateEquipment}
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
        text="Da li ste sigurni da želite da obrišete ovu stavku?"
      />
    </div>
  );
};

export default AdminOtherEquipment;
