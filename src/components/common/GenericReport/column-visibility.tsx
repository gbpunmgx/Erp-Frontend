import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "./types";

export const ColumnVisibility: React.FC<{
  columns: ColumnDef[];
  currentVisibleIds: string[];
  onVisibilityChange: (id: string, visible: boolean) => void;
  onClose: () => void;
}> = ({ columns, currentVisibleIds, onVisibilityChange, onClose }) => {
  return (
    <DialogContent className="max-h-[80vh] w-full max-w-sm sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-base sm:text-lg">Column Visibility</DialogTitle>
        <DialogDescription className="text-sm">Select columns to display</DialogDescription>
      </DialogHeader>
      <div className="max-h-60 space-y-2 overflow-y-auto">
        {columns.map((column, index) => (
          <div key={`col-vis-${column.id}-${index}`} className="flex items-center justify-between px-1 py-2.5 sm:px-2">
            <Label className="mr-2 flex-1 truncate text-xs sm:text-sm">{column.header}</Label>
            <Checkbox
              checked={currentVisibleIds.includes(column.id)}
              onCheckedChange={(checked) => onVisibilityChange(column.id, !!checked)}
              className="h-4 w-4"
            />
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} className="text-xs sm:text-sm">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
