"use client";

import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Column } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { ResponsivePagination } from "@/components/common/GenericReport/responsive-pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  pageSizeOptions?: number[];
  initialPage?: number;
  initialPageSize?: number;
  excludeFromSearch?: (keyof T)[];
};

export function DataTable<T extends object>({
  data,
  columns,
  initialPage = 1,
  initialPageSize = 10,
  excludeFromSearch = [],
}: DataTableProps<T>) {
  const [filters, setFilters] = React.useState<Partial<Record<keyof T, string>>>({});
  const [filterColumn, setFilterColumn] = React.useState<keyof T>(columns[0].key);
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = React.useState(true);
  const [visibleColumns, setVisibleColumns] = React.useState<(keyof T)[]>(columns.map((c) => c.key));
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = React.useState(initialPageSize);

  const filteredData = React.useMemo(() => {
    const val = filters[filterColumn];
    if (!val) return data;
    return data.filter((row) =>
      String(row[filterColumn] ?? "")
        .toLowerCase()
        .includes(val.toLowerCase()),
    );
  }, [filters, filterColumn, data]);

  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      return sortAsc
        ? String(av ?? "").localeCompare(String(bv ?? ""))
        : String(bv ?? "").localeCompare(String(av ?? ""));
    });
  }, [filteredData, sortKey, sortAsc]);

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        columns={columns.map((c) => ({ key: c.key, header: c.header }))}
        visibleColumns={visibleColumns}
        onVisibilityChange={setVisibleColumns}
        filter={filters[filterColumn] ?? ""}
        onFilterChange={(val) => setFilters((prev) => ({ ...prev, [filterColumn]: val }))}
        filterColumn={filterColumn}
        onFilterColumnChange={setFilterColumn}
        excludeFromSearch={excludeFromSearch}
      />

      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b-2 bg-gray-50 dark:bg-black">
                {columns
                  .filter((c) => visibleColumns.includes(c.key))
                  .map((col) => (
                    <TableHead
                      key={String(col.key)}
                      className={`${col.sortable ? "cursor-pointer" : ""} text-gray-900 dark:text-gray-100`}
                      onClick={() => {
                        if (col.sortable) {
                          if (sortKey === col.key) setSortAsc(!sortAsc);
                          else {
                            setSortKey(col.key);
                            setSortAsc(true);
                          }
                        }
                      }}
                    >
                      <div className="flex items-center gap-1 font-semibold">
                        {col.header}
                        {col.sortable &&
                          sortKey === col.key &&
                          (sortAsc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                      </div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="h-24 text-center text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                <TooltipProvider delayDuration={200}>
                  {paginatedData.map((row, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      {columns
                        .filter((c) => visibleColumns.includes(c.key))
                        .map((col) => {
                          const rawValue = (row as any)[col.key] ?? ""; // handle "actions"
                          const value = col.render ? col.render(rawValue, row) : String(rawValue);

                          const isLongText = typeof value === "string" && value.length > 46;

                          const displayText = isLongText ? value.slice(0, 46) + "..." : value;

                          return (
                            <TableCell
                              key={String(col.key)}
                              className="align-top text-sm text-gray-800 dark:text-gray-100"
                            >
                              {isLongText ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="block max-w-[320px] cursor-help truncate">{displayText}</span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[400px] break-words">{value}</TooltipContent>
                                </Tooltip>
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  ))}
                </TooltipProvider>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ResponsivePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={sortedData.length}
        onItemsPerPageChange={(val) => {
          setItemsPerPage(Number(val));
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
