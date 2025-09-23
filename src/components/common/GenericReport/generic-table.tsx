import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { ResponsiveTableContainer } from "./responsive-table-container";
import { TableSkeleton } from "./table-skeleton";
import { ColumnDef, GenericTableProps } from "./types";

export const GenericTable = <TData extends Record<string, unknown>>({
  data,
  columns,
  onSort,
  loading = false,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
}: GenericTableProps<TData>) => {
  const extractTextFromCell = (cellValue: any, row: any, column: ColumnDef): string => {
    if (column.cell) {
      const renderedCell = column.cell(cellValue, row);
      if (React.isValidElement(renderedCell)) {
        if (renderedCell.type === "Badge") {
          return renderedCell.props.children ?? String(cellValue ?? "");
        }
        return String(renderedCell.props?.children ?? cellValue ?? "");
      }
      return String(renderedCell ?? cellValue ?? "");
    }
    return String(cellValue ?? "");
  };

  const visibleColumns = columns.filter((col) => col.visible !== false);

  if (loading) {
    return <TableSkeleton columns={visibleColumns.length} />;
  }

  return (
    <ResponsiveTableContainer>
      <div className="w-full min-w-max overflow-x-auto">
        <Table className="w-full table-auto" style={{ tableLayout: "auto" }}>
          <TableHeader className="bg-background sticky top-0 z-10">
            <TableRow>
              {visibleColumns.map((column, colIndex) => (
                <TableHead
                  key={`header-${column.id}-${colIndex}`}
                  className={`px-2 py-2.5 sm:px-3 sm:py-3 ${column.sortable ? "hover:bg-muted/50 cursor-pointer" : ""}`}
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    minWidth: "auto",
                    width: "auto",
                  }}
                >
                  {column.sortable && onSort ? (
                    <button
                      onClick={() => onSort(column.accessorKey)}
                      className="flex h-auto w-full cursor-pointer items-center justify-start gap-1 border-none bg-transparent p-0 text-left text-xs sm:text-sm"
                    >
                      <span className="text-xs font-medium sm:text-sm">{column.header}</span>
                      <ArrowUpDown className="ml-1 h-3 w-3 flex-shrink-0" />
                    </button>
                  ) : (
                    <span className="text-xs font-medium sm:text-sm">{column.header}</span>
                  )}
                </TableHead>
              ))}
              {(onEdit ?? onDelete) && (
                <TableHead className="px-2 py-2.5 text-right sm:px-3 sm:py-3">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={`row-${(row as any).id ?? `row-${rowIndex}`}`} className="hover:bg-muted/50 border-b">
                  {visibleColumns.map((column, colIndex) => {
                    const value = row[column.accessorKey];
                    const displayValue = column.cell ? column.cell(value, row) : String(value ?? "");
                    return (
                      <TableCell
                        key={`cell-${column.id}-${(row as any).id ?? rowIndex}-${colIndex}`}
                        className="px-2 py-2.5 sm:px-3 sm:py-3"
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          minWidth: "auto",
                          width: "auto",
                          maxWidth: "none",
                        }}
                      >
                        <div
                          className="text-xs sm:text-sm"
                          title={
                            typeof displayValue === "string" ? displayValue : extractTextFromCell(value, row, column)
                          }
                        >
                          {displayValue}
                        </div>
                      </TableCell>
                    );
                  })}
                  {(onEdit ?? onDelete) && (
                    <TableCell className="px-2 py-2.5 text-right sm:px-3 sm:py-3">
                      <div className="flex justify-end gap-1">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(row)}
                            className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                          >
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(row)}
                            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-800 sm:h-8 sm:w-8"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + ((onEdit ?? onDelete) ? 1 : 0)}
                  className="h-20 py-8 text-center sm:h-24"
                >
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {searchTerm ? `No results matching "${searchTerm}".` : "No data found."}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </ResponsiveTableContainer>
  );
};
