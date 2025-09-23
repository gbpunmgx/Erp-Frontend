"use client";
import React, { useState, useMemo, useCallback } from "react";
import { ResponsiveHeader } from "./responsive-header";
import { GenericTable } from "./generic-table";
import { ResponsivePagination } from "./responsive-pagination";
import { ResponsiveContainer } from "./responsive-container";
import { DownloadDialog } from "./download-dialog";
import { ColumnVisibility } from "./column-visibility";
import { FilterPopoverContent } from "./filter-popover-content";
import { GenericForm, FormProps } from "./generic-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Filter, Columns, Download } from "lucide-react";
import { ColumnDef } from "./types";

interface GenericReportProps<TData extends Record<string, unknown>> {
  title: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  icon: React.ReactNode;
  onSubmitAdd?: (data: TData) => void;
  FormComponent?: React.ComponentType<FormProps<TData>>;
}

export const GenericReport = <TData extends Record<string, unknown>>({
  title,
  data,
  columns,
  icon,
  onSubmitAdd,
  FormComponent = GenericForm,
}: GenericReportProps<TData>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<TData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" | null }>({
    key: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(columns.map((col) => col.id));

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    let filtered = data.filter((item) =>
      columns.some((col) => String(item[col.accessorKey]).toLowerCase().includes(searchTerm.toLowerCase())),
    );
    Object.entries(filters).forEach(([colId, filterVal]) => {
      const col = columns.find((c) => c.id === colId);
      if (col && filterVal) {
        filtered = filtered.filter((item) =>
          String(item[col.accessorKey]).toLowerCase().includes(filterVal.toLowerCase()),
        );
      }
    });
    return filtered;
  }, [data, searchTerm, filters, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof TData];
      const bVal = b[sortConfig.key as keyof TData];
      const aStr = String(aVal ?? "").toLowerCase();
      const bStr = String(bVal ?? "").toLowerCase();

      if (aStr < bStr) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aStr > bStr) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = useCallback(
    (key: keyof TData) => {
      let direction: "asc" | "desc" = "asc";
      if (sortConfig.key === String(key) && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key: String(key), direction });
      setCurrentPage(1);
    },
    [sortConfig],
  );

  const handleFilterChange = useCallback((colId: string, value: string) => {
    setFilters((prev) => ({ ...prev, [colId]: value }));
    setCurrentPage(1);
  }, []);

  const handleVisibilityChange = useCallback((id: string, visible: boolean) => {
    setVisibleColumnIds((prev) => {
      const newIds = new Set(prev);
      if (visible) {
        newIds.add(id);
      } else {
        newIds.delete(id);
      }
      return Array.from(newIds);
    });
  }, []);

  const visibleColumns = useMemo(
    () => columns.map((col) => ({ ...col, visible: visibleColumnIds.includes(col.id) })),
    [columns, visibleColumnIds],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
      }
    },
    [currentPage, totalPages],
  );

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setIsAddDialogOpen(true);
  }, []);

  const handleEdit = useCallback((row: TData) => {
    setEditingItem(row);
    setIsAddDialogOpen(true);
  }, []);

  const handleDelete = useCallback((row: TData) => {
    console.log("Delete", row);
  }, []);

  const handleSubmit = useCallback(
    (formData: TData) => {
      if (onSubmitAdd) {
        onSubmitAdd(formData);
      }
      setIsAddDialogOpen(false);
      setEditingItem(null);
    },
    [onSubmitAdd],
  );

  return (
    <ResponsiveContainer className="min-h-[calc(100vh-64px)]">
      <div className="space-y-4 sm:space-y-6">
        <ResponsiveHeader
          title={title}
          icon={icon}
          totalRecords={data.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          rightActions={
            <div className="flex items-center gap-1 sm:gap-2">
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 text-xs whitespace-nowrap sm:h-10 sm:text-sm">
                    <Filter className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <FilterPopoverContent
                    columns={visibleColumns}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </PopoverContent>
              </Popover>

              <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 text-xs whitespace-nowrap sm:h-10 sm:text-sm">
                    <Columns className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Columns
                  </Button>
                </DialogTrigger>
                <ColumnVisibility
                  columns={columns}
                  currentVisibleIds={visibleColumnIds}
                  onVisibilityChange={handleVisibilityChange}
                  onClose={() => setIsColumnDialogOpen(false)}
                />
              </Dialog>

              <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 text-xs whitespace-nowrap sm:h-10 sm:text-sm">
                    <Download className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Export
                  </Button>
                </DialogTrigger>
                <DownloadDialog
                  isOpen={isDownloadOpen}
                  onClose={() => setIsDownloadOpen(false)}
                  data={sortedData}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  columns={visibleColumns}
                  visibleColumns={visibleColumnIds}
                />
              </Dialog>

              {onSubmitAdd && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-9 text-xs whitespace-nowrap sm:h-10 sm:text-sm" onClick={handleAdd}>
                      <Plus className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <FormComponent
                    item={editingItem ?? undefined}
                    onSubmit={handleSubmit}
                    onClose={() => setIsAddDialogOpen(false)}
                  />
                </Dialog>
              )}
            </div>
          }
        />

        <div className="min-h-[calc(100vh-200px)]">
          <GenericTable
            data={paginatedData}
            columns={visibleColumns}
            onSort={handleSort}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {totalPages > 0 && (
            <ResponsivePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={sortedData.length}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </ResponsiveContainer>
  );
};
