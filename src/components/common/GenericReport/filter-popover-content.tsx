import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ColumnDef } from "./types";

export const FilterPopoverContent: React.FC<{
  columns: ColumnDef[];
  filters: Record<string, string>;
  onFilterChange: (colId: string, value: string) => void;
}> = ({ columns, filters, onFilterChange }) => {
  return (
    <div className="max-h-80 w-72 space-y-3 overflow-y-auto p-3 sm:w-80">
      <h3 className="mb-3 text-xs font-medium sm:text-sm">Column Filters</h3>
      {columns
        .filter((col) => col.filterable && col.visible !== false)
        .map((column, index) => (
          <div key={`filter-${column.id}-${index}`} className="space-y-1.5">
            <Label className="text-xs font-medium capitalize">{column.header}</Label>
            {column.options ? (
              <Select value={filters[column.id] || ""} onValueChange={(val) => onFilterChange(column.id, val)}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder={`Filter ${column.header}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {column.options.map((opt, optIndex) => (
                    <SelectItem key={`opt-${opt.value}-${optIndex}`} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder={`Filter ${column.header}`}
                value={filters[column.id] || ""}
                onChange={(e) => onFilterChange(column.id, e.target.value)}
                className="h-9 w-full text-sm"
              />
            )}
          </div>
        ))}
      {columns.filter((col) => col.filterable && col.visible !== false).length === 0 && (
        <p className="text-muted-foreground py-4 text-center text-xs sm:text-sm">No filterable columns available</p>
      )}
    </div>
  );
};
