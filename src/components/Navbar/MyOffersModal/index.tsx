import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import usePrintedContent from "../../../hooks/usePrintedContent";
import Table, { TableColumn } from "../../ui/Table";
import Modal from "../../ui/Modal";
import Loading from "../../ui/Loading";
import Button from "../../ui/Button";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import useDatePickerLocale from "../../../hooks/useDatePickerLocale";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { User } from "../../../types";

interface MyOffersModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedUser?: User | null;
}

const MyOffersModal: React.FC<MyOffersModalProps> = ({
  isOpen,
  setIsOpen,
  selectedUser,
}) => {
  const { t } = useTranslation();
  const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  const locale = useDatePickerLocale();
  const {
    printedContents,
    isLoading,
    isError,
    fetchPrintedContents,
    setPrintedContents,
  } = usePrintedContent(selectedUser?.id || 0);

  const onMainModalClose = () => {
    setPrintedContents([]);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && shouldFetch) {
      fetchPrintedContents(
        selectedUser ? "admin" : "user",
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      setShouldFetch(false);
    }
  }, [
    isOpen,
    shouldFetch,
    fetchPrintedContents,
    startDate,
    endDate,
    selectedUser,
  ]);

  const columns: TableColumn[] = [
    {
      header: t("ID"),
      accessor: "id",
      render: (row) => (
        <div className="flex justify-center">
          <Button
            variant="link"
            onClick={() => {
              setSelectedContent(row.content);
              setIsContentModalOpen(true);
            }}
          >
            {row.id}
          </Button>
        </div>
      ),
    },
    {
      header: t("created-at"),
      accessor: "created_at",
      render: (row) => (
        <div className="flex justify-center">
          {new Date(row.created_at).toLocaleString()}
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onMainModalClose} title={t("my-offers")}>
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <div className="flex-1">
            <label className="block mb-1.5 text-sm font-medium text-primary-grey-dark">{t("from-date")}:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => date && setStartDate(date)}
              locale={locale}
              className="bg-white border border-primary-grey-lightest text-primary-grey-dark text-sm rounded-lg w-full p-2.5 outline-none transition-colors focus:border-primary-green focus:ring-2 focus:ring-inset focus:ring-primary-green/30"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1.5 text-sm font-medium text-primary-grey-dark">{t("to-date")}:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => date && setEndDate(date)}
              locale={locale}
              className="bg-white border border-primary-grey-lightest text-primary-grey-dark text-sm rounded-lg w-full p-2.5 outline-none transition-colors focus:border-primary-green focus:ring-2 focus:ring-inset focus:ring-primary-green/30"
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => setShouldFetch(true)}
              icon={faSearch}
              className="ml-2"
            >
              {t("filter")}
            </Button>
          </div>
        </div>

        {isLoading && <Loading />}
        {isError && <p>{t("errorFetchingOffers")}</p>}
        {!isLoading && !isError && printedContents && (
          <Table columns={columns} data={printedContents} striped pagination />
        )}
      </Modal>

      <Modal
        isOpen={isContentModalOpen}
        onClose={() => {
          setIsContentModalOpen(false);
          setSelectedContent(null);
        }}
        title={t("content-details")}
        size="3xl"
      >
        <div
          className="bg-white p-4 rounded-lg"
          dangerouslySetInnerHTML={{ __html: selectedContent || "" }}
        />
      </Modal>
    </>
  );
};

export default MyOffersModal;
