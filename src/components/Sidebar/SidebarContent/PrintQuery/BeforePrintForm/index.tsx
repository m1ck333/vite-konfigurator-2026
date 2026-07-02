import React, { useState, useEffect } from "react";
import Modal from "../../../../ui/Modal";
import Input from "../../../../ui/Input";
import Button from "../../../../ui/Button";
import Checkbox from "../../../../ui/Checkbox";
import { useTranslation } from "react-i18next";
import useDoorPrice from "../../../../../hooks/useDoorPrice";
import { useSelector } from "react-redux";
import { selectUserData } from "../../../../../features/user/userSlice";

interface BeforePrintFormProps {
  isMarkupModalOpen: boolean;
  setIsMarkupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onMarkupContinue: () => void;
}

const BeforePrintForm = ({
  isMarkupModalOpen,
  setIsMarkupModalOpen,
  onMarkupContinue,
}: BeforePrintFormProps) => {
  const { t } = useTranslation();
  const [vatVal, setVatVal] = useState(0);
  const [discountVal, setDiscountVal] = useState(0);
  const [showInputs, setShowInputs] = useState(false);

  const usersData = useSelector(selectUserData);

  const defaultMarkupLabel =
    usersData?.markups?.find((markup) => markup.default)?.markup_label || 0;

  const [markupVal, setMarkupVal] = useState(defaultMarkupLabel);

  useEffect(() => {
    setMarkupVal(defaultMarkupLabel);
  }, [defaultMarkupLabel]);

  const { fetchPrice, isLoading: isPriceLoading } = useDoorPrice();

  const onContinueClick = async () => {
    try {
      await fetchPrice(vatVal, discountVal, markupVal);
      onMarkupContinue();
    } catch (error) {
      console.error("Failed to fetch price:", error);
    }
  };

  return (
    <Modal
      size="xs"
      isOpen={isMarkupModalOpen}
      onClose={() => setIsMarkupModalOpen(false)}
    >
      <div className="flex flex-col items-center gap-3 py-1">
        <Checkbox
          checked={showInputs}
          onChange={(checked) => setShowInputs(checked)}
          label={
            showInputs
              ? t("hideAdditionalSettings")
              : t("showAdditionalSettings")
          }
        />

        {showInputs && (
          <div className="flex items-end gap-2">
            <Input
              label={t("vat")}
              type="number"
              name="vat"
              value={vatVal}
              onChange={(e) => setVatVal(Number(e.target.value))}
            />

            <Input
              label={t("discount")}
              type="number"
              name="discount"
              value={discountVal}
              onChange={(e) => setDiscountVal(Number(e.target.value))}
            />

            <Input
              label={t("markup")}
              type="number"
              name="markup"
              value={markupVal}
              onChange={(e) => setMarkupVal(Number(e.target.value))}
            />
          </div>
        )}

        <Button onClick={onContinueClick} isLoading={isPriceLoading}>
          {t("continue")}
        </Button>
      </div>
    </Modal>
  );
};

export default BeforePrintForm;
