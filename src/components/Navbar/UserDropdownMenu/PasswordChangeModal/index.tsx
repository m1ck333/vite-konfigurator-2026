import React from "react";
import { useTranslation } from "react-i18next";

import Modal from "../../../ui/Modal";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import usePasswordChangeForm from "../../../../hooks/usePasswordChangeForm ";

interface PasswordChangeModalProps {
  isModalOpen: boolean;
  onModalClose: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isModalOpen,
  onModalClose,
}) => {
  const { t } = useTranslation();
  const { formData, handleInputChange, handleSubmit, isMutating } =
    usePasswordChangeForm();

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onModalClose}
      title={t("changePassword")}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Input
            name="currentPassword"
            type="password"
            label={t("currentPassword")}
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
          />
          <Input
            name="newPassword"
            type="password"
            label={t("newPassword")}
            value={formData.newPassword}
            onChange={handleInputChange}
            required
          />
          <Input
            name="confirmPassword"
            type="password"
            label={t("confirmPassword")}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

          <div className="flex justify-between mt-4">
            <Button
              variant="link"
              type="button"
              className="pl-0"
              onClick={() => {
                onModalClose();
              }}
            >
              {t("personalInfo")}
            </Button>

            <Button type="submit" isLoading={isMutating}>
              {t("update")}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordChangeModal;
