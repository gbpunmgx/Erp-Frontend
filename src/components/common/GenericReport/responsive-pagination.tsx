import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export const ResponsivePagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  loading?: boolean;
  onItemsPerPageChange?: (value: string) => void;
}> = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, loading = false, onItemsPerPageChange }) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const getVisiblePages = useCallback((): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = () => {
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePageInputSubmit();
    }
  };

  React.useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-64" />
      </div>
    );
  }

  if (totalPages === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span className="hidden sm:inline">
          Showing <span className="text-foreground font-medium">{startItem.toLocaleString()}</span> to{" "}
          <span className="text-foreground font-medium">{endItem.toLocaleString()}</span> of{" "}
          <span className="text-foreground font-medium">{totalItems.toLocaleString()}</span> results
        </span>
        <span className="sm:hidden">
          {startItem.toLocaleString()} - {endItem.toLocaleString()} of {totalItems.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-sm sm:inline">Rows per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
              <SelectTrigger className="h-9 w-[75px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="hidden h-9 w-9 sm:flex"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-9 w-9"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="hidden items-center gap-1 sm:flex">
            {getVisiblePages().map((page, index) =>
              typeof page === "string" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="text-muted-foreground flex h-9 w-9 items-center justify-center"
                >
                  •••
                </span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(page)}
                  className="h-9 w-9"
                >
                  {page}
                </Button>
              ),
            )}
          </div>

          <div className="flex items-center gap-2 border-l pl-2">
            <span className="text-muted-foreground hidden text-sm sm:inline">Go to:</span>
            <Input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyPress={handleKeyPress}
              onBlur={handlePageInputSubmit}
              className="h-9 w-16 text-center"
              min={1}
              max={totalPages}
              placeholder={currentPage.toString()}
            />
            <span className="text-muted-foreground text-sm"> {totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden h-9 w-9 sm:flex"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
