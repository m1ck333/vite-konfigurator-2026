import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../../app/store";
import useUserForm from "../../../../hooks/useUserForm";
import { registerUser, editUser } from "../../../../features/user/userSlice";
import SectionHeading from "../../../ui/SectionHeading";
import UserFormFields from "../UserFormFields";
import Modal from "../../../ui/Modal";
import FormFooter from "../../AdminComponents/FormFooter";
import { User } from "../../../../types";
import { useUsers } from "../../../../hooks/useUsers";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  selectedUser?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  mode,
  selectedUser,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const { formData, handleChange, validate, resetForm, setFormData, errors } =
    useUserForm();
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useUsers(false);

  useEffect(() => {
    if (mode === "edit" && selectedUser) {
      setFormData({ ...selectedUser, confirm_password: "" });
    } else if (mode === "create") {
      resetForm();
    }
  }, [mode, selectedUser, setFormData, resetForm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (mode === "create") {
        const resultAction = await dispatch(registerUser(formData));
        unwrapResult(resultAction);
        toast.success(t("auth-messages.register-successfully"));
      } else if (mode === "edit" && selectedUser) {
        const { confirm_password, ...updatedData } = formData;
        const resultAction = await dispatch(
          editUser({ userId: selectedUser.id, updatedData })
        );
        unwrapResult(resultAction);
        toast.success(t("auth-messages.update-successfully"));
      }

      await refetch();
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Component error:", error);

      if (error.email) {
        toast.error(t(error.email[0]));
      } else if (typeof error === "string") {
        toast.error(t(error));
      } else if (error instanceof Error) {
        toast.error(t(error.message));
      } else {
        toast.error(t("auth-messages.an-unknown-error-occurred"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <div className="flex flex-col align-center gap-6">
        <SectionHeading>
          {mode === "create"
            ? t("register-new-user")
            : t("update-user", { username: selectedUser?.username || "" })}
        </SectionHeading>

        <form onSubmit={handleSubmit}>
          <UserFormFields
            formData={formData}
            handleInputChange={handleChange}
            setFormData={setFormData}
            errors={errors}
            mode={mode}
          />
          <FormFooter onCancel={onClose} isMutating={isLoading} />
        </form>
      </div>
    </Modal>
  );
};

export default UserModal;
