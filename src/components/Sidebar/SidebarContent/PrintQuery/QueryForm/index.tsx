import React from "react";
import { useTranslation } from "react-i18next";
import { faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";

import useInquiryForm from "../../../../../hooks/useInquiryForm";
import { textInputFields } from "./textInputFields";
import { InquiryFormFields } from "../../../../../types";
import Modal from "../../../../ui/Modal";
import Input from "../../../../ui/Input";
import TextArea from "../../../../ui/TextArea";
import Button from "../../../../ui/Button";

interface QueryFormProps {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  innerDoorImage: string | null;
  outerDoorImage: string | null;
}

const QueryForm: React.FC<QueryFormProps> = ({
  isModalOpen,
  setModalOpen,
  innerDoorImage,
  outerDoorImage,
}) => {
  const { t } = useTranslation();

  const {
    formRef,
    handleSubmit,
    formErrors,
    isSubmitting,
    clearFieldError,
    setFormErrors,
  } = useInquiryForm(setModalOpen, innerDoorImage, outerDoorImage);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setModalOpen(false);
        setFormErrors({});
      }}
      title={t("inquiry")}
    >
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {textInputFields.map(({ name, type, placeholderKey, required }) => (
          <label key={name} className="block">
            <Input
              type={type}
              placeholder={t(placeholderKey)}
              onChange={(e) =>
                clearFieldError(e.target.name as keyof InquiryFormFields)
              }
              name={name}
              label={t(placeholderKey)}
              required={required}
            />

            {formErrors[name as keyof InquiryFormFields] && (
              <div className="text-danger text-sm">
                {formErrors[name as keyof InquiryFormFields]}
              </div>
            )}
          </label>
        ))}

        <TextArea
          label={t("yourMessage")}
          name="message"
          placeholder={t("yourMessage")}
          rows={4}
        />

        <div className="text-danger text-xs italic mb-4">
          * {t("requiredFields")}
        </div>

        <div className="flex justify-between">
          <Button
            variant="danger"
            icon={faXmark}
            onClick={() => setModalOpen(false)}
          >
            {t("cancel")}
          </Button>

          <Button type="submit" isLoading={isSubmitting} icon={faPaperPlane}>
            {t("send")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QueryForm;
