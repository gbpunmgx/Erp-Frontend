"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Database } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  dataSize?: string;
  showDataSize?: boolean;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  itemsLabel?: string;
  className?: string;
}

export function Pagination({
  totalItems,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  dataSize,
  showDataSize = true,
  pageSizeOptions = [10, 20, 30, 50, 100],
  showPageSizeSelector = true,
  itemsLabel = "items",
  className = "",
}: PaginationProps) {
  const currentPage = pageIndex + 1;
  const totalPages = Math.ceil(totalItems / pageSize);
  const maxVisiblePages = 5;

  const startIndex = pageIndex * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPageIndex(page - 1);
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
    <div
      className={`border-border/60 from-card/80 via-card/90 to-card/95 flex items-center justify-between border-t bg-gradient-to-r px-6 py-4 backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-6">
        {showPageSizeSelector && (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm font-medium">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                const newSize = Number(value);
                setPageSize(newSize);
                setPageIndex(0);
              }}
            >
              <SelectTrigger className="border-input bg-background/90 hover:border-primary/50 hover:bg-accent/50 focus:ring-primary/20 h-9 w-20 shadow-sm transition-all duration-300 focus:ring-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={`pagesize-${size}`} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Database className="text-primary h-4 w-4" />
          <span className="text-foreground font-medium">{formatDataSizeInfo()}</span>
          {showDataSize && dataSize && <span className="text-muted-foreground">{itemsLabel}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="hover:border-primary/50 hover:bg-accent/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="border-primary/20 bg-primary/10 flex items-center gap-1 rounded-md border px-3 py-1">
          <span className="text-foreground text-sm font-medium">{currentPage}</span>
          <span className="text-muted-foreground text-sm">of</span>
          <span className="text-foreground text-sm font-medium">{totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="hover:border-primary/50 hover:bg-accent/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
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
          className="hover:border-primary/50 hover:bg-accent/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="hover:border-primary/50 hover:bg-accent/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="mx-3 flex items-center gap-1">
          {visiblePages.map((pageNum) => (
            <Button
              key={`page-${pageNum}`}
              size="sm"
              onClick={() => goToPage(pageNum)}
              className={`h-9 min-w-9 px-3 font-medium transition-all duration-300 ${
                currentPage === pageNum
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105 shadow-lg"
                  : "hover:border-primary/50 hover:bg-accent/50 hover:scale-105"
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
          className="hover:border-primary/50 hover:bg-accent/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="hover:border-primary/50 hover:bg-accent/50 h-9 px-3 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
