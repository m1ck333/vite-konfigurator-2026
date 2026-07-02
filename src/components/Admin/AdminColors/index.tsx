import React, { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SectionHeading from "../../ui/SectionHeading";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Table, { TableColumn } from "../../ui/Table";
import { Color } from "../../../types";
import { useColors } from "../../../hooks/useColors";
import AdminColorForm from "./AdminColorForm";
import { SkeletonTable } from "../../ui/Skeleton";
import Error from "../../ui/Error";
import AdminCategories from "./AdminCategories";
import TabSwitcher from "../../ui/TabSwitcher";
import StatusIndicator from "../AdminComponents/AdminTableItems/StatusIndicator";
import ImagePreview from "../AdminComponents/AdminTableItems/ImagePreview";
import AdminDeleteConfirmationModal from "../AdminComponents/AdminTableItems/AdminDeleteConfirmationModal";
import ActionButtons from "../../ui/Table/ActionButtons";
import { findItemTranslations } from "../../../utils";

const AdminColors: React.FC = () => {
  const {
    colors,
    isLoading,
    isError,
    isMutating,
    deleteColor,
    addOrUpdateColor,
    categories,
  } = useColors();

  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"colors" | "categories">("colors");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleErrorModalOpen = (isOpen: boolean) => {
    setIsErrorModalOpen(isOpen);
  };

  const handleDeleteClick = (color: Color) => {
    setColorToDelete(color);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (colorToDelete) {
      try {
        await deleteColor(colorToDelete.id);
        toast.success("Boja je uspešno obrisana");
      } catch (error) {
        toast.error("Greška prilikom brisanja boje");
      } finally {
        setColorToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const handleAddOrUpdateColor = async (colorData: Partial<Color>) => {
    try {
      await addOrUpdateColor(editingColor ? editingColor.id : null, colorData);
      toast.success(
        editingColor ? "Boja je uspešno ažurirana" : "Boja je uspešno dodata"
      );
    } catch (error) {
      toast.error("Greška prilikom čuvanja boje");
    } finally {
      setIsFormModalOpen(false);
      setEditingColor(null);
    }
  };

  const handleCancel = () => {
    setIsFormModalOpen(false);
    setEditingColor(null);
  };

  const handleEditClick = (color: Color) => {
    setEditingColor(color);
    setIsFormModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingColor(null);
    setIsFormModalOpen(true);
  };

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: true },
    {
      header: "Kod boje",
      accessor: "color_code",
      sortable: true,
      filterable: true,
    },
    {
      header: "Ime kategorije",
      accessor: "color_category.translations",
      render: (row: Color) =>
        findItemTranslations(row.color_category?.translations || []).name ||
        "-",
      sortable: true,
      filterable: true,
    },
    {
      header: "Cena",
      accessor: "price",
      render: (row: Color) => (row.price ? row.price.toString() : "-"),
      sortable: true,
      filterable: true,
    },
    {
      header: "Redosled",
      accessor: "sort",
      render: (row: Color) => (row.sort_order ? `#${row.sort_order}` : "-"),
    },
    {
      header: "Pregled",
      accessor: "color_hex",
      render: (row: Color) => (
        <ImagePreview
          colorHex={row.color_hex}
          thumbnail={row.thumbnail}
          name={row.color_code}
        />
      ),
    },
    {
      header: "Status",
      accessor: "is_shown",
      render: (row: Color) => <StatusIndicator isShown={row.is_shown} />,
      sortable: true,
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-3 p-4">
        <SectionHeading>Boje</SectionHeading>

        <TabSwitcher
          activeTab={activeTab}
          tabs={[
            { label: "Boje", value: "colors" },
            { label: "Kategorije", value: "categories" },
          ]}
          onTabChange={setActiveTab}
        />

        {activeTab === "colors" && (
          <>
            <div className="flex justify-center">
              <Button
                icon={faPlus}
                onClick={handleAddNewClick}
                className="w-fit"
                disabled={isLoading}
              >
                Dodaj novu boju
              </Button>
            </div>

            {isLoading && <SkeletonTable />}
            {isError && <Error message="Došlo je do greške" />}

            {colors && (
              <Table
                striped
                pagination
                columns={columns}
                data={colors}
                actionButtons={(row: Color) => (
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
                title={editingColor ? "Ažuriraj boju" : "Dodaj novu boju"}
                closeOnOutsideClick={!isErrorModalOpen}
              >
                <AdminColorForm
                  color={editingColor}
                  onSubmit={handleAddOrUpdateColor}
                  onCancel={handleCancel}
                  isMutating={isMutating}
                  categories={categories || []}
                  setErrorModalOpen={handleErrorModalOpen}
                />
              </Modal>
            )}

            <AdminDeleteConfirmationModal
              isMutating={isMutating}
              setIsConfirmModalOpen={setIsConfirmModalOpen}
              handleConfirmDelete={handleConfirmDelete}
              isConfirmModalOpen={isConfirmModalOpen}
              text="Da li ste sigurni da želite da obrišete ovu boju?"
            />
          </>
        )}
      </div>
      {activeTab === "categories" && <AdminCategories />}
    </>
  );
};

export default AdminColors;
