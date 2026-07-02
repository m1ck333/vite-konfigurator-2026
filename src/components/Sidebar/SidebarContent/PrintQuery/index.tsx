import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { faClipboardList, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";

import usePrepareConfiguration from "../../../../hooks/usePrepareConfiguration";
import useDoorBothSidesImagesReturn from "../../../../hooks/useDoorBothSidesImagesReturn";
import ContentToPrint from "./ContentToPrint";
import QueryForm from "./QueryForm";
import Button from "../../../ui/Button";
import { selectIsLoggedIn } from "../../../../features/user/userSlice";
import BeforePrintForm from "./BeforePrintForm";
import usePrintedContent from "../../../../hooks/usePrintedContent";

const PrintQuery: React.FC = () => {
  const { t } = useTranslation();
  const { sectionsSerbian, sectionsUserLang } = usePrepareConfiguration();
  const componentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMarkupModalOpen, setIsMarkupModalOpen] = useState(false);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { isLoading, innerDoorImage, outerDoorImage } =
    useDoorBothSidesImagesReturn();

  const { savePrintedContent } = usePrintedContent();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSaveAndPrint = async () => {
    if (!componentRef.current) return;

    const htmlContent = componentRef.current.innerHTML;

    try {
      await savePrintedContent({
        content: htmlContent,
        user_id: isLoggedIn ? 1 : null,
      });

      handlePrint();
    } catch (error) {
      console.error("Failed to save printed content:", error);
    }
  };

  const onMarkupContinue = () => {
    handleSaveAndPrint();
  };
  const renderSection = (
    title: string,
    sectionData: Record<string, string | null>
  ) => (
    <div className="mb-3 rounded-xl border border-primary-grey-lightest bg-white p-4">
      <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-primary-grey">
        {title}
      </p>

      <div className="flex flex-col">
        {Object.entries(sectionData).map(([key, value]) => {
          if (value) {
            return (
              <div
                key={key}
                className="flex justify-between items-center gap-3 py-1.5 border-b border-primary-grey-lightest/60 last:border-b-0"
              >
                <span className="text-sm text-primary-grey-dark">{`${key}:`}</span>
                <span className="text-sm font-medium text-primary-green-dark text-end">
                  {value}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );

  return (
    <>
      {Object.entries(sectionsUserLang).map(([sectionName, section]) => (
        <React.Fragment key={sectionName}>
          {renderSection(section.title, section.data)}
        </React.Fragment>
      ))}

      <div className="mt-6 flex justify-between">
        <Button
          variant="primary-green"
          onClick={() => setModalOpen(true)}
          icon={faClipboardList}
        >
          {t("inquiry")}
        </Button>

        <Button
          variant="primary-green"
          onClick={isLoggedIn ? () => setIsMarkupModalOpen(true) : handlePrint}
          isLoading={isLoading}
          icon={faPrint}
        >
          {t("print")}
        </Button>
      </div>

      <div className="print-only">
        <ContentToPrint
          ref={componentRef}
          sections={sectionsSerbian}
          innerDoorImage={innerDoorImage}
          outerDoorImage={outerDoorImage}
        />
      </div>

      <QueryForm
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        innerDoorImage={innerDoorImage}
        outerDoorImage={outerDoorImage}
      />

      <BeforePrintForm
        isMarkupModalOpen={isMarkupModalOpen}
        setIsMarkupModalOpen={setIsMarkupModalOpen}
        onMarkupContinue={onMarkupContinue}
      />
    </>
  );
};

export default PrintQuery;
