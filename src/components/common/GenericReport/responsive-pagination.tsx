import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 1;
    const rangeWithDots: (number | string)[] = [1];
    const l = Math.max(2, currentPage - delta);
    const r = Math.min(totalPages - 1, currentPage + delta);

    for (let i = l; i <= r; i++) {
      rangeWithDots.push(i);
    }

    if (r < totalPages - 1) {
      rangeWithDots.push("...");
    }
    rangeWithDots.push(totalPages);
    return rangeWithDots;
  }, [currentPage, totalPages]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const handlePageInputSubmit = () => {
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setPageInput(pageNum.toString());
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
      <Card className="w-full">
        <CardContent className="p-2 sm:p-3">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <Skeleton className="h-4 w-full sm:w-48" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalPages === 0) return null;

  return (
    <div className="w-full">
      <CardContent className="p-2 sm:p-3">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-3">
          <div className="text-muted-foreground w-full text-center text-xs sm:w-auto sm:text-left sm:text-sm">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
            {totalItems.toLocaleString()} results
          </div>

          <div className="flex w-full items-center justify-center gap-1 sm:w-auto sm:justify-end sm:gap-2">
            {onItemsPerPageChange && (
              <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
                <SelectTrigger className="h-8 w-16 sm:w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center gap-0.5 sm:gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1 || totalPages === 0}
                className="h-7 w-7 p-0 text-xs sm:h-8 sm:w-8"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || totalPages === 0}
                className="h-7 w-7 p-0 text-xs sm:h-8 sm:w-8"
              >
                ‹
              </Button>

              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={pageInput}
                  onChange={handlePageInputChange}
                  onKeyPress={handleKeyPress}
                  onBlur={handlePageInputSubmit}
                  className="h-7 w-12 p-1 text-center text-xs sm:h-8 sm:w-14"
                  min={1}
                  max={totalPages}
                  disabled={totalPages === 0}
                />
                <span className="text-muted-foreground text-xs">of {totalPages}</span>
              </div>

              {getVisiblePages().map((page, index) => (
                <React.Fragment key={`page-fragment-${index}-${typeof page === "string" ? page : ""}`}>
                  {typeof page === "string" ? (
                    <span className="text-muted-foreground flex h-7 w-7 items-center justify-center text-xs sm:h-8 sm:w-8">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={`btn-${page}`}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      disabled={totalPages === 0}
                      className="h-7 w-7 p-0 text-xs sm:h-8 sm:w-8"
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-7 w-7 p-0 text-xs sm:h-8 sm:w-8"
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-7 w-7 p-0 text-xs sm:h-8 sm:w-8"
              >
                {totalPages}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
