"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Columns3, Check } from "lucide-react";

type DataTableToolbarProps<T> = {
  columns: { key: keyof T; header: string }[];
  visibleColumns: (keyof T)[];
  onVisibilityChange: (visible: (keyof T)[]) => void;
  filter: string;
  onFilterChange: (val: string) => void;
  filterColumn: keyof T;
  onFilterColumnChange: (col: keyof T) => void;
  excludeFromSearch?: (keyof T)[];
};

export function DataTableToolbar<T>({
  columns,
  visibleColumns,
  onVisibilityChange,
  filter,
  onFilterChange,
  filterColumn,
  onFilterColumnChange,
  excludeFromSearch = [],
}: DataTableToolbarProps<T>) {
  const filterableColumns = columns.filter((c) => !excludeFromSearch.includes(c.key));
  const currentFilterColumn = columns.find((c) => c.key === filterColumn);

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder={`Search ${currentFilterColumn?.header.toLowerCase() ?? "table"}...`}
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-background border-border focus-visible:ring-ring h-10 pl-9 focus-visible:ring-2"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="border-border hover:bg-accent h-10 gap-2 whitespace-nowrap"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter by:</span>
              <span className="font-medium">{currentFilterColumn?.header}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter Column</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterableColumns.map((col) => (
              <DropdownMenuItem
                key={String(col.key)}
                onClick={() => onFilterColumnChange(col.key)}
                className="flex cursor-pointer items-center justify-between"
              >
                <span>{col.header}</span>
                {col.key === filterColumn && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default" className="border-border hover:bg-accent h-10 gap-2">
            <Columns3 className="h-4 w-4" />
            <span>Columns</span>
            <span className="bg-muted text-muted-foreground ml-1 rounded-md px-1.5 py-0.5 text-xs font-medium">
              {visibleColumns.length}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {columns.map((col) => {
            const isVisible = visibleColumns.includes(col.key);
            return (
              <DropdownMenuCheckboxItem
                key={String(col.key)}
                checked={isVisible}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onVisibilityChange([...visibleColumns, col.key]);
                  } else {
                    onVisibilityChange(visibleColumns.filter((k) => k !== col.key));
                  }
                }}
                className="cursor-pointer"
              >
                {col.header}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
