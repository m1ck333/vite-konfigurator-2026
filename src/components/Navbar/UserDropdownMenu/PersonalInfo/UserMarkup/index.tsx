import React, { useState, useEffect } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Table, { TableColumn } from "../../../../ui/Table";
import Button from "../../../../ui/Button";
import Modal from "../../../../ui/Modal";
import { Markup } from "../../../../../types";
import Input from "../../../../ui/Input";
import { useTranslation } from "react-i18next";
import Checkbox from "../../../../ui/Checkbox";
import ActionButtons from "../../../../ui/Table/ActionButtons";

interface UserMarkupProps {
  markups?: Markup[];
  onAdd: (markup: Pick<Markup, "markup_label" | "markup_value">) => void;
  onEdit: (
    id: number,
    markup: Pick<Markup, "markup_label" | "markup_value">
  ) => void;
  onDelete: (id: number) => void;
  isMutating: boolean;
  updateDefaultMarkup: (id: number | null) => void;
}

const UserMarkup: React.FC<UserMarkupProps> = ({
  markups = [],
  onAdd,
  onEdit,
  onDelete,
  isMutating,
  updateDefaultMarkup,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [markupIdToDelete, setMarkupIdToDelete] = useState<number | null>(null);
  const [editingMarkup, setEditingMarkup] = useState<Markup | null>(null);
  const [markupLabel, setMarkupLabel] = useState<number | "">("");
  const [markupValue, setMarkupValue] = useState<number | "">("");
  const [selectedDefaultId, setSelectedDefaultId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const defaultMarkup = markups.find((markup) => markup.default);
    if (defaultMarkup) {
      setSelectedDefaultId(defaultMarkup.id);
    }
  }, [markups]);

  const handleAdd = () => {
    setEditingMarkup(null);
    setMarkupLabel("");
    setMarkupValue("");
    setModalOpen(true);
  };

  const handleEdit = (markup: Markup) => {
    setEditingMarkup(markup);
    setMarkupLabel(markup.markup_label);
    setMarkupValue(markup.markup_value);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setMarkupIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const onDefaultChange = (isChecked: boolean, id: number) => {
    const newDefaultId = isChecked ? id : null;
    setSelectedDefaultId(newDefaultId);
    updateDefaultMarkup(newDefaultId);
  };

  const handleSubmit = () => {
    const markupData = {
      markup_label: typeof markupLabel === "number" ? markupLabel : 0,
      markup_value: typeof markupValue === "number" ? markupValue : 0,
    };

    if (editingMarkup) {
      onEdit(editingMarkup.id, markupData);
    } else {
      onAdd(markupData);
    }
    setModalOpen(false);
  };

  const columns: TableColumn[] = [
    {
      header: t("label"),
      accessor: "markup_label",
      sortable: true,
    },
    { header: t("value"), accessor: "markup_value", sortable: true },
    {
      header: t("use"),
      accessor: "default",
      render: (row) => (
        <Checkbox
          label=""
          checked={selectedDefaultId === row.id}
          onChange={(isChecked) => {
            onDefaultChange(isChecked, row.id);
          }}
          scale="small"
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button icon={faPlus} onClick={handleAdd} />
      </div>

      <Table
        columns={columns}
        data={markups}
        striped
        pagination
        actionButtons={(row: Markup) => (
          <ActionButtons
            onEdit={() => handleEdit(row)}
            onDelete={() => handleDeleteClick(row.id)}
          />
        )}
      />

      <Modal
        isOpen={isConfirmModalOpen && markupIdToDelete !== null}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Potvrda brisanja"
      >
        <div className="space-y-4">
          <p>{t("are-you-sure-delete-markup")}</p>
          <div className="flex space-x-4">
            <Button
              variant="danger"
              onClick={() => {
                onDelete(markupIdToDelete || 0);
                setIsConfirmModalOpen(false);
              }}
              isLoading={isMutating}
            >
              {t("yes-delete")}
            </Button>
            <Button
              onClick={() => setIsConfirmModalOpen(false)}
              disabled={isMutating}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </Modal>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title={editingMarkup ? t("update-markup") : t("add-markup")}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="flex justify-between mb-4">
              <Input
                label={t("label")}
                type="number"
                name="markup_label"
                value={markupLabel}
                onChange={(e) =>
                  setMarkupLabel(e.target.value ? parseInt(e.target.value) : "")
                }
                required
              />

              <Input
                label={t("value")}
                type="number"
                name="markup_value"
                value={markupValue}
                onChange={(e) =>
                  setMarkupValue(
                    e.target.value ? parseFloat(e.target.value) : ""
                  )
                }
                required
              />
            </div>

            <Button type="submit">
              {editingMarkup ? t("update-markup") : t("add-markup")}
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default UserMarkup;
