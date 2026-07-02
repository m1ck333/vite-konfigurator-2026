import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import Modal from "../../../ui/Modal";
import Button from "../../../ui/Button";
import usePersonalInfoForm from "../../../../hooks/usePersonalInfoForm";
import PasswordChangeModal from "../PasswordChangeModal";
import { fetchUserData } from "../../../../features/user/userSlice";
import { AppDispatch } from "../../../../app/store";
import UserFormFields from "../../../Admin/Users/UserFormFields";
import UserMarkup from "./UserMarkup";
import { usePersonalInfoModal } from "./context/PersonalInfoContext";

interface PersonalInfoProps {
  setIsPersonalInfoModalVisible: (visible: boolean) => void;
  isModalOpen: boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  setIsPersonalInfoModalVisible,
  isModalOpen,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { activeModal, openModal, closeModal } = usePersonalInfoModal();
  const {
    formData,
    handleInputChange,
    handleSubmit,
    setFormData,
    markups,
    addMarkup,
    editMarkup,
    deleteMarkup,
    isMutating,
    updateDefaultMarkup,
  } = usePersonalInfoForm();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await handleSubmit(formData);
    if (success) {
      dispatch(fetchUserData());
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsPersonalInfoModalVisible(false)}
        title={t("personalInfo")}
      >
        <form onSubmit={handleFormSubmit}>
          <UserFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
            mode="edit"
          />
          <div className="flex justify-between mt-4">
            <Button
              variant="link"
              type="button"
              className="pl-0"
              onClick={() => {
                openModal("password");
              }}
            >
              {t("changePassword")}
            </Button>

            <Button
              variant="link"
              type="button"
              className="pl-0"
              onClick={() => openModal("markups")}
            >
              {t("manage-markups")}
            </Button>

            <Button type="submit" isLoading={isMutating}>
              {t("update")}
            </Button>
          </div>
        </form>
      </Modal>

      <PasswordChangeModal
        isModalOpen={activeModal === "password"}
        onModalClose={closeModal}
      />

      <Modal
        isOpen={activeModal === "markups"}
        onClose={closeModal}
        title={t("manage-markups")}
        closeOnOutsideClick
      >
        <UserMarkup
          markups={markups}
          onAdd={addMarkup}
          onEdit={editMarkup}
          onDelete={deleteMarkup}
          isMutating={isMutating}
          updateDefaultMarkup={updateDefaultMarkup}
        />
      </Modal>
    </>
  );
};

export default PersonalInfo;
