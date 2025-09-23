import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveTableContainer } from "./responsive-table-container";

export const TableSkeleton: React.FC<{ columns: number }> = ({ columns = 20 }) => (
  <ResponsiveTableContainer>
    <Table className="table-layout: auto">
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={`skeleton-header-${i}`} className="px-2 py-2.5 sm:px-3 sm:py-3">
              <Skeleton className="h-4 w-16 sm:w-20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={`skeleton-row-${index}`}>
            {Array.from({ length: columns }).map((_, i) => (
              <TableCell key={`skeleton-cell-${index}-${i}`} className="px-2 py-2.5 sm:px-3 sm:py-3">
                <Skeleton className="h-4 w-20 sm:w-24" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </ResponsiveTableContainer>
);
