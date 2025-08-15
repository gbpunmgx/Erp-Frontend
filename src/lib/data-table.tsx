"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Filter, Search, X, ArrowUpDown } from "lucide-react";
import { Pagination } from "@/components/common";
import { ActionsCell } from "@/lib/actions-cell";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterComponent } from "@/lib/filter-component";
import { BulkActionsBar } from "@/lib/bulk-actions-bar";

export function DataTable<TData>({
  columns,
  data,
  dataSize,
  showDataSize = true,
  showActionsColumn = true,
  actionsColumnWidth = "100px",
  pageSizeOptions = [10, 25, 50, 100],
  filterOptions = {},
  actionsConfig = {},
  enableRowSelection = true,
  bulkActions = {},
}: {
  columns: ColumnDef<TData>[];
  data: TData[];
  dataSize?: string;
  showDataSize?: boolean;
  showActionsColumn?: boolean;
  actionsColumnWidth?: string;
  pageSizeOptions?: number[];
  filterOptions?: { [key: string]: { value: string; label: string }[] };
  actionsConfig?: {
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onCopy?: (row: TData) => void;
    onDownload?: (row: TData) => void;
    onShare?: (row: TData) => void;
    onArchive?: (row: TData) => void;
    onFavorite?: (row: TData) => void;
    onComment?: (row: TData) => void;
    customActions?: Array<{
      label: string;
      icon?: React.ComponentType<{ className?: string }>;
      onClick: (row: TData) => void;
      variant?: "default" | "destructive";
      separator?: boolean;
    }>;
  };
  enableRowSelection?: boolean;
  bulkActions?: {
    onBulkDelete?: (rows: TData[]) => void;
    onBulkDownload?: (rows: TData[]) => void;
    onBulkCopy?: (rows: TData[]) => void;
    onBulkShare?: (rows: TData[]) => void;
    customActions?: Array<{
      label: string;
      icon?: React.ComponentType<{ className?: string }>;
      onClick: (rows: TData[]) => void;
      variant?: "default" | "destructive";
    }>;
  };
}) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const columnsWithSelection = React.useMemo<ColumnDef<TData>[]>(() => {
    const baseColumns = enableRowSelection
      ? [
          {
            id: "select",
            header: ({ table }: any) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected() ?? (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary border-2"
              />
            ),
            cell: ({ row }: any) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary border-2"
              />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 50,
          },
          ...columns,
        ]
      : columns;

    if (!showActionsColumn) return baseColumns;

    return [
      ...baseColumns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionsCell row={row.original} {...actionsConfig} />,
        enableSorting: false,
        enableHiding: false,
        size: parseInt(actionsColumnWidth),
      },
    ];
  }, [columns, showActionsColumn, actionsColumnWidth, actionsConfig, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    state: { columnFilters, sorting, rowSelection },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: pageSizeOptions[0] ?? 10, pageIndex: 0 } },
  });

  const hasActiveFilters = columnFilters.length > 0;
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const selectedRowData = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

  const sortIcons: { [key in "asc" | "desc" | "false"]: React.ReactElement } = {
    asc: <ArrowUpDown className="text-primary h-4 w-4 rotate-180" />,
    desc: <ArrowUpDown className="text-primary h-4 w-4" />,
    false: <ArrowUpDown className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />,
  };

  return (
    <div>
      {enableRowSelection && (
        <BulkActionsBar
          selectedCount={selectedRowCount}
          onClearSelection={() => setRowSelection({})}
          bulkActions={bulkActions}
          selectedRows={selectedRowData}
        />
      )}

      {hasActiveFilters && (
        <div className="bg-primary/5 border-primary/20 flex items-center justify-between border-b px-6 py-3">
          <div className="flex items-center gap-3">
            <Filter className="text-primary h-4 w-4" />
            <span className="text-foreground text-sm font-medium">
              {columnFilters.length} filter{columnFilters.length > 1 ? "s" : ""} active
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="text-primary hover:bg-primary/10 hover:text-primary h-8 px-3 transition-all duration-300"
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}

      <div className="bg-card/50 relative max-h-[calc(100vh-275px)] flex-1 overflow-x-auto overflow-y-auto backdrop-blur-sm">
        <table id="table-main" className="min-w-full">
          <TableHeader className="bg-card/95 border-border/60 sticky top-0 z-20 border-b backdrop-blur-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                <TableRow className="border-border/40 border-b hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-muted-foreground border-border/40 from-card/95 to-card/90 border-r bg-gradient-to-b px-4 py-4 font-semibold whitespace-nowrap backdrop-blur-md last:border-r-0"
                    >
                      <div
                        className={`group flex items-center justify-between gap-2 ${
                          header.column.getCanSort()
                            ? "hover:text-primary cursor-pointer transition-all duration-300 select-none"
                            : ""
                        }`}
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <span className="text-sm font-semibold tracking-wide">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="text-muted-foreground/50 group-hover:text-primary transition-all duration-300">
                            {sortIcons[header.column.getIsSorted() as "asc" | "desc" | "false"] ?? sortIcons.false}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow className="border-border/40 bg-card/95 sticky border-b backdrop-blur-md hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={`filter-${header.id}`}
                      className="border-border/40 from-card/90 to-card/80 border-r bg-gradient-to-b px-4 py-3 backdrop-blur-md last:border-r-0"
                    >
                      {header.column.getCanFilter() &&
                        header.column.id !== "actions" &&
                        header.column.id !== "select" && (
                          <FilterComponent column={header.column} filterOptions={filterOptions[header.column.id]} />
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              </React.Fragment>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnsWithSelection.length} className="py-16 text-center">
                  <div className="text-muted-foreground flex flex-col items-center gap-6">
                    <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
                      <Search className="text-primary h-10 w-10" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-foreground text-2xl font-semibold">No results found</p>
                      <p className="text-muted-foreground max-w-md text-sm">
                        Try adjusting your search criteria or clear filters to see more results
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-accent/30 border-border/20 border-b transition-all duration-300 ${
                    index % 2 === 0 ? "bg-card/30" : "bg-card/50"
                  } ${row.getIsSelected() ? "bg-primary/10 hover:bg-primary/15" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const content = flexRender(cell.column.columnDef.cell, cell.getContext());
                    const isLongContent = typeof content === "string" && content.length > 255;
                    return (
                      <TableCell
                        key={cell.id}
                        className={`border-border/20 border-r px-4 text-sm transition-all duration-300 last:border-r-0 ${
                          isLongContent ? "max-w-[200px] overflow-hidden text-ellipsis" : ""
                        }`}
                      >
                        <div className="truncate">{content}</div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>
      <div className="shrink-0">
        <Pagination
          table={table}
          pageIndex={table.getState().pagination.pageIndex}
          setPageIndex={(index) => table.setPageIndex(index)}
          pageSize={table.getState().pagination.pageSize}
          setPageSize={(size) => table.setPageSize(size)}
          dataSize={dataSize}
          showDataSize={showDataSize}
          pageSizeOptions={pageSizeOptions}
        />
      </div>
    </div>
  );
}
