import {
  faCog,
  faInbox,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import TablePagination from "./TablePagination";
import { useTranslation } from "react-i18next";

export interface TableColumn {
  header: string;
  accessor: string;
  render?: (row: any) => JSX.Element | string;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn[];
  data: T[];
  actionButtons?: (row: T) => JSX.Element;
  striped?: boolean;
  pagination?: boolean;
}

const Table = <T extends { [key: string]: any }>({
  columns,
  data,
  actionButtons,
  striped,
  pagination,
}: TableProps<T>) => {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (accessor: string) => {
    if (!sortConfig || sortConfig.key !== accessor) {
      setSortConfig({ key: accessor, direction: "asc" });
    } else {
      setSortConfig({
        key: accessor,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    }
  };

  const handleFilterChange = (accessor: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [accessor]: value,
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (value: string | null) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((value, key) => value?.[key], obj);
  };

  const filteredData = React.useMemo(() => {
    return data.filter((row) =>
      columns.every((column) => {
        const filterValue = filters[column.accessor];
        if (!filterValue) return true;
        const cellValue = getNestedValue(row, column.accessor);
        return cellValue
          ? cellValue
              .toString()
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          : false;
      })
    );
  }, [data, filters, columns]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      // Handle null and undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
      if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

      // If both are numbers, sort numerically
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Convert to strings for case-insensitive sorting
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-primary-grey-lightest shadow-sm">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`px-4 py-2 bg-primary-light border-b border-primary-grey-lightest text-center text-xs leading-4 font-semibold text-primary-grey-dark uppercase tracking-wider ${
                  column.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => column.sortable && handleSort(column.accessor)}
              >
                {column.header}
                {column.sortable && (
                  <FontAwesomeIcon
                    icon={
                      sortConfig?.key === column.accessor
                        ? sortConfig.direction === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                    className="ml-2"
                  />
                )}
              </th>
            ))}
            {actionButtons && (
              <th className="px-4 py-2 bg-primary-light border-b border-primary-grey-lightest text-center text-xs leading-4 font-semibold text-primary-grey-dark uppercase tracking-wider">
                <FontAwesomeIcon icon={faCog} />
              </th>
            )}
          </tr>
          <tr className="bg-primary-light border-b border-primary-grey-lightest">
            {columns.map((column) =>
              column.filterable ? (
                <th
                  key={column.accessor}
                  className={`px-4 py-2 text-xs font-medium ${column.className}`}
                >
                  <input
                    type="text"
                    value={filters[column.accessor] || ""}
                    onChange={(e) =>
                      handleFilterChange(column.accessor, e.target.value)
                    }
                    placeholder={`Pretraga ${column.header}`}
                    className="w-full px-2 py-1 text-sm bg-white border border-primary-grey-lightest rounded focus:border-primary-green focus:outline-none focus:ring-1 focus:ring-primary-green/30"
                  />
                </th>
              ) : (
                <th
                  key={column.accessor}
                  className="px-4 py-2 text-center text-xs leading-4 font-medium text-primary-grey uppercase tracking-wider"
                />
              )
            )}
            {actionButtons && (
              <th className="px-4 py-2 text-center text-xs leading-4 font-medium text-primary-grey uppercase tracking-wider"></th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b border-primary-grey-lightest/60 transition-colors hover:bg-primary-light ${
                  striped && rowIndex % 2 === 1 ? "bg-primary-light/40" : "bg-white"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className="px-4 py-2 text-sm leading-5 text-primary-grey-dark"
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
                {actionButtons && (
                  <td className="px-4 py-2 text-sm leading-5 text-primary-grey-dark">
                    {actionButtons(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actionButtons ? 1 : 0)}
                className="px-4 py-12 text-center"
              >
                <div className="flex flex-col items-center gap-3 text-primary-grey">
                  <FontAwesomeIcon icon={faInbox} className="text-3xl opacity-40" />
                  <span className="text-sm">{t("no-results-found")}</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default Table;
