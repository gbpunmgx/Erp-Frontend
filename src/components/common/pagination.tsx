"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Database } from "lucide-react";

type Props<TData> = {
  table: Table<TData>;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  dataSize?: string;
  showDataSize?: boolean;
  pageSizeOptions: number[] | undefined;
};

export function Pagination<RowData>({
  table,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  dataSize,
  showDataSize = true,
  pageSizeOptions,
}: Props<RowData>) {
  const currentPage = pageIndex + 1;
  const totalPages = table.getPageCount();
  const totalItems = table.getFilteredRowModel().rows.length;
  const maxVisiblePages = 5;

  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const newIndex = page - 1;
      setPageIndex(newIndex);
      table.setPageIndex(newIndex);
    }
  };

  const getVisiblePages = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    const end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const formatDataSizeInfo = (): string => {
    const baseInfo = `${startIndex + 1}-${endIndex} of ${totalItems}`;
    if (showDataSize && dataSize) {
      return `${baseInfo} (${dataSize} total)`;
    }
    return baseInfo;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="border-border/60 from-card/80 via-card/90 to-card/95 flex items-center justify-between border-t bg-gradient-to-r px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm font-medium">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              const newSize = Number(value);
              setPageSize(newSize);
              table.setPageSize(newSize);
              setPageIndex(0); // Reset to first page when page size changes
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="border-input bg-background/90 hover:bg-accent/50 hover:border-primary/50 focus:ring-primary/20 h-9 w-20 shadow-sm transition-all duration-300 focus:ring-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions?.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Database className="text-primary h-4 w-4" />
          <span className="text-foreground font-medium">{formatDataSizeInfo()}</span>
          {showDataSize && dataSize && <span className="text-muted-foreground">entries</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="hover:bg-accent/50 hover:border-primary/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="bg-primary/10 border-primary/20 flex items-center gap-1 rounded-md border px-3 py-1">
          <span className="text-foreground text-sm font-medium">{currentPage}</span>
          <span className="text-muted-foreground text-sm">of</span>
          <span className="text-foreground text-sm font-medium">{totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="hover:bg-accent/50 hover:border-primary/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="hover:bg-accent/50 hover:border-primary/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="hover:bg-accent/50 hover:border-primary/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="mx-3 flex items-center gap-1">
          {visiblePages.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(pageNum)}
              className={`h-9 min-w-9 px-3 font-medium transition-all duration-300 ${
                currentPage === pageNum
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105 shadow-lg"
                  : "hover:bg-accent/50 hover:border-primary/50 hover:scale-105"
              }`}
            >
              {pageNum}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="hover:bg-accent/50 hover:border-primary/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="hover:bg-accent/50 hover:border-primary/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
