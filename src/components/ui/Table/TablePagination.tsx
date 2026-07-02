import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Select from "../Select";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string | null) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4">
      <Select
        options={[
          { value: "10", label: "10" },
          { value: "25", label: "25" },
          { value: "50", label: "50" },
          { value: "100", label: "100" },
        ]}
        value={itemsPerPage.toString()}
        onChange={onItemsPerPageChange}
      />

      <div>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 rounded-full border border-primary-grey-lightest bg-white text-primary-grey-dark hover:bg-primary-light hover:text-primary-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>

        <span className="px-4 py-2 mx-1 text-sm text-primary-grey-dark">
          {t("page")} {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 rounded-full border border-primary-grey-lightest bg-white text-primary-grey-dark hover:bg-primary-light hover:text-primary-green disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
