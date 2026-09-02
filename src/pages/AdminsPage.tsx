import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { faUserPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

import SectionHeading from "../components/ui/SectionHeading";
import Loading from "../components/ui/Loading";
import Error from "../components/ui/Error";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import Table, { TableColumn } from "../components/ui/Table";
import { selectUserData } from "../features/user/userSlice";
import { useAdmins, AdminAccount, AdminPayload } from "../hooks/useAdmins";

const CITY_OPTIONS = [
  { value: "", label: "—" },
  { value: "Beograd", label: "Beograd" },
  { value: "Niš", label: "Niš" },
];

// Create/edit a staff account. On edit the username is fixed and the password is optional
// (blank = keep current). role + city are always editable.
const AdminModal: React.FC<{
  editing: AdminAccount | null;
  isSelf: boolean;
  onClose: () => void;
  onSaved: () => void;
  t: (k: string) => string;
}> = ({ editing, isSelf, onClose, onSaved, t }) => {
  const { createAdmin, updateAdmin } = useAdmins(false);
  const [username, setUsername] = useState(editing?.username ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>(editing?.role ?? "admin");
  const [city, setCity] = useState<string>(editing?.city ?? "");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && (!username.trim() || !password)) {
      toast.error(t("form.validationFailed"));
      return;
    }
    setBusy(true);
    try {
      const payload: AdminPayload = { role, city: city || null };
      if (!editing) {
        payload.username = username.trim();
        payload.password = password;
      } else if (password) {
        payload.password = password;
      }
      const res = editing ? await updateAdmin(editing.id, payload) : await createAdmin(payload);
      if (!res.ok) {
        toast.error(res.status === 409 ? t("username-taken") : t("auth-messages.an-unknown-error-occurred"));
        return;
      }
      toast.success(editing ? t("auth-messages.update-successfully") : t("auth-messages.register-successfully"));
      onSaved();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen onClose={() => !busy && onClose()} size="md" title={editing ? `${t("edit")} — ${editing.username}` : t("create-admin")}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input
          label={t("username")}
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!!editing}
          required={!editing}
        />
        <Input
          label={editing ? t("new-password-optional") : t("password")}
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={editing ? t("leave-blank-keep-password") : ""}
          required={!editing}
        />
        {isSelf ? (
          <div>
            <span className="mb-1.5 block text-sm font-medium text-primary-grey-dark">{t("role")}</span>
            <p className="text-sm text-primary-grey">{t("role-superadmin")}</p>
          </div>
        ) : (
          <Select label={t("role")} value={role} onChange={(v) => setRole(v || "admin")} options={[
            { value: "admin", label: t("role-admin") },
            { value: "superadmin", label: t("role-superadmin") },
          ]} />
        )}
        <Select label={t("city")} value={city} onChange={(v) => setCity(v || "")} options={CITY_OPTIONS} />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="link" onClick={onClose} disabled={busy}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary-green" isLoading={busy}>
            {editing ? t("save") : t("create-admin")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const AdminsPage: React.FC = () => {
  const { t } = useTranslation();
  const me = useSelector(selectUserData);
  const { admins, isLoading, isError, deleteAdmin, refetch } = useAdmins();
  const [modal, setModal] = useState<{ editing: AdminAccount | null } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminAccount | null>(null);
  const [busy, setBusy] = useState(false);

  // Staff management is superadmin-only (the server enforces it too).
  if (me && me.role !== "superadmin") return <Navigate to="/admin" replace />;

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      const res = await deleteAdmin(pendingDelete.id);
      if (!res.ok) toast.error(t("auth-messages.an-unknown-error-occurred"));
    } finally {
      setBusy(false);
      setPendingDelete(null);
    }
  };

  const columns: TableColumn[] = [
    { header: "ID", accessor: "id", sortable: true, filterable: false },
    { header: t("username"), accessor: "username", sortable: true, filterable: true },
    {
      header: t("role"),
      accessor: "role",
      sortable: true,
      filterable: true,
      render: (row: AdminAccount) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            row.role === "superadmin" ? "bg-primary-green/15 text-primary-green-dark" : "bg-primary-grey-lightest text-primary-grey-dark"
          }`}
        >
          {row.role === "superadmin" ? t("role-superadmin") : t("role-admin")}
        </span>
      ),
    },
    {
      header: t("city"),
      accessor: "city",
      sortable: true,
      filterable: true,
      render: (row: AdminAccount) => row.city || "—",
    },
    {
      header: t("actions"),
      accessor: "actions",
      sortable: false,
      filterable: false,
      render: (row: AdminAccount) => (
        <div className="flex items-center justify-center gap-1">
          <Button variant="icon" onClick={() => setModal({ editing: row })} className="text-primary-green hover:text-primary-green-dark" icon={faPen} />
          <Button
            variant="icon"
            onClick={() => setPendingDelete(row)}
            className="text-danger hover:text-danger-dark"
            icon={faTrash}
            disabled={row.id === me?.id}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-3 p-4">
        <SectionHeading>{t("administrators")}</SectionHeading>

        <div className="flex justify-center">
          <Button type="button" onClick={() => setModal({ editing: null })} icon={faUserPlus} className="w-fit">
            {t("create-admin")}
          </Button>
        </div>

        {isLoading ? (
          <Loading variant="primary-light" />
        ) : isError ? (
          <Error />
        ) : (
          <Table pagination striped columns={columns} data={admins} />
        )}
      </div>

      {modal && (
        <AdminModal
          editing={modal.editing}
          isSelf={modal.editing?.id === me?.id}
          onClose={() => setModal(null)}
          onSaved={refetch}
          t={t}
        />
      )}

      {pendingDelete && (
        <Modal isOpen onClose={() => !busy && setPendingDelete(null)} size="sm" title={t("delete")}>
          <p className="mb-5 text-sm text-primary-grey-dark">
            {t("confirm-delete-admin")} <b>{pendingDelete.username}</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="link" onClick={() => setPendingDelete(null)} disabled={busy}>
              {t("cancel")}
            </Button>
            <Button variant="danger" icon={faTrash} onClick={confirmDelete} isLoading={busy}>
              {t("delete")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminsPage;
