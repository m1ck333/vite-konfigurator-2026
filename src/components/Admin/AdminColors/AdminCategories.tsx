import React, { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Table, { TableColumn } from "../../ui/Table";
import { ColorCategory } from "../../../types";
import { useColors } from "../../../hooks/useColors";
import AdminCategoryForm from "./AdminCategoryForm";
import { SkeletonTable } from "../../ui/Skeleton";
import Error from "../../ui/Error";
import ActionButtons from "../../ui/Table/ActionButtons";
import { findItemTranslations } from "../../../utils";
import StatusIndicator from "../AdminComponents/AdminTableItems/StatusIndicator";

const AdminCategories: React.FC = () => {
  const {
    categories,
    isLoading,
    isError,
    isMutating,
    deleteCategory,
    addOrUpdateCategory,
  } = useColors();

  const [editingCategory, setEditingCategory] = useState<ColorCategory | null>(
    null
  );
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ColorCategory | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const isErrorWithMessage = (error: unknown): error is { message: string } => {
    return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as any).message === "string"
    );
  };

  const handleDeleteCategoryClick = (category: ColorCategory) => {
    setCategoryToDelete(category);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
        toast.success("Kategorija je uspešno obrisana");
      } catch (error) {
        if (isErrorWithMessage(error)) {
          toast.error(
            error.message ===
              "Category has associated colors and cannot be deleted."
              ? "Kategorija ima povezane boje i ne može biti obrisana."
              : "Greška prilikom brisanja kategorije"
          );
        } else {
          toast.error("Greška prilikom brisanja kategorije");
        }
      } finally {
        setCategoryToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const handleAddOrUpdateCategory = async (
    categoryData: Partial<ColorCategory>
  ) => {
    try {
      await addOrUpdateCategory(
        editingCategory ? editingCategory.id : null,
        categoryData,
        categoryData.translations || []
      );

      toast.success(
        editingCategory
          ? "Kategorija je uspešno ažurirana"
          : "Kategorija je uspešno dodata"
      );
    } catch (error) {
      toast.error("Greška prilikom čuvanja kategorije");
    } finally {
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    }
  };

  const handleCancelCategory = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleEditCategoryClick = (category: ColorCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddNewCategoryClick = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: true },
    {
      header: "Ime kategorije",
      accessor: "translations",
      render: (row: ColorCategory) =>
        findItemTranslations(row.translations || []).name || "-",
      sortable: true,
      filterable: true,
    },
    {
      header: "Prikazano u panelu",
      accessor: "show_in_panel",
      render: (row: ColorCategory) => (
        <StatusIndicator isShown={row.show_in_panel} />
      ),
      sortable: true,
      filterable: true,
    },
    {
      header: "Prikazano u štoku",
      accessor: "show_in_stock",
      render: (row: ColorCategory) => (
        <StatusIndicator isShown={row.show_in_stock} />
      ),
      sortable: true,
      filterable: true,
    },
    {
      header: "Redosled",
      accessor: "sort",
      render: (row: ColorCategory) =>
        row.sort_order ? `#${row.sort_order}` : "-",
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex justify-center">
        <Button
          icon={faPlus}
          onClick={handleAddNewCategoryClick}
          className="w-fit"
          disabled={isLoading}
        >
          Dodaj novu kategoriju
        </Button>
      </div>

      {isLoading && <SkeletonTable />}
      {isError && <Error message="Došlo je do greške" />}

      {categories && (
        <Table
          striped
          pagination
          columns={columns}
          data={categories}
          actionButtons={(row: ColorCategory) => (
            <ActionButtons
              onEdit={() => handleEditCategoryClick(row)}
              onDelete={() => handleDeleteCategoryClick(row)}
            />
          )}
        />
      )}

      {isCategoryModalOpen && (
        <Modal
          isOpen={isCategoryModalOpen}
          onClose={handleCancelCategory}
          title={
            editingCategory ? "Ažuriraj kategoriju" : "Dodaj novu kategoriju"
          }
        >
          <AdminCategoryForm
            category={editingCategory}
            onSubmit={handleAddOrUpdateCategory}
            onCancel={handleCancelCategory}
            isMutating={isMutating}
          />
        </Modal>
      )}

      {isConfirmModalOpen && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Potvrda brisanja"
        >
          <div className="space-y-4">
            <p>Da li ste sigurni da želite da obrišete ovu kategoriju?</p>
            <div className="flex space-x-4">
              <Button
                variant="danger"
                onClick={handleConfirmDeleteCategory}
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
      )}
    </div>
  );
};

export default AdminCategories;
