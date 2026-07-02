import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import SectionHeading from "../components/ui/SectionHeading";
import Button from "../components/ui/Button";
import { useUsers } from "../hooks/useUsers";
import Table, { TableColumn } from "../components/ui/Table";
import Loading from "../components/ui/Loading";
import Error from "../components/ui/Error";
import { User } from "../types";
import DeleteUserModal from "../components/Admin/Users/Modals/DeleteUserModal";
import { faClipboardList, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import ActionButtons from "../components/ui/Table/ActionButtons";
import UserModal from "../components/Admin/Users/Modals/UserModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyOffersModal from "../components/Navbar/MyOffersModal";

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const { users, isLoading, isError } = useUsers();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const openOffersModal = (user: User) => {
    setSelectedUser(user);
    setIsOffersModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsUserModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: false },
    {
      header: "Ime kompanije",
      accessor: "company_name",
      sortable: true,
      filterable: true,
    },
    {
      header: "Korisničko ime",
      accessor: "username",
      sortable: true,
      filterable: true,
    },
    { header: "Email", accessor: "email", sortable: true, filterable: true },
    {
      header: "Actions",
      accessor: "actions",
      sortable: false,
      filterable: false,
      render: (row: User) => (
        <div className="flex justify-center items-center space-x-2 h-full">
          <ActionButtons
            onEdit={() => openEditModal(row)}
            onDelete={() => openDeleteModal(row)}
          />

          <Button
            variant="icon"
            onClick={() => openOffersModal(row)}
            className="text-primary-green-dark hover:text-primary-dark"
          >
            <FontAwesomeIcon icon={faClipboardList} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col align-center gap-3 p-4">
        <SectionHeading>{t("users")}</SectionHeading>

        <div className="flex justify-center">
          <Button
            type="button"
            onClick={openCreateModal}
            icon={faUserPlus}
            className="w-fit"
          >
            {t("register-new-user")}
          </Button>
        </div>

        {isLoading ? (
          <Loading variant="primary-light" />
        ) : isError ? (
          <Error />
        ) : (
          <Table pagination striped columns={columns} data={users} />
        )}
      </div>

      {isUserModalOpen && (
        <UserModal
          isOpen={isUserModalOpen}
          onClose={closeModal}
          mode={modalMode}
          selectedUser={selectedUser}
        />
      )}

      {selectedUser && (
        <DeleteUserModal
          onClose={closeModal}
          isOpen={isDeleteModalOpen}
          selectedUser={selectedUser}
        />
      )}

      {selectedUser && (
        <MyOffersModal
          setIsOpen={() => setIsOffersModalOpen(false)}
          isOpen={isOffersModalOpen}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default UsersPage;
